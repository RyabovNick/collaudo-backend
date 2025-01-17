# Collaudo

## Database structure

### Таблицы с вопросами (изменение для админов)

**theme:** Содержит список тем. Каждый вопрос принадлежит к конкретной теме. Студентам за всё прохождение теста должны примерно равномерно задаться вопросы из каждой темы, для этого добавлен параметр count_question - максимальное количество вопросов в тесте по этой теме

**type:** Содержит список типов. Это возможные структуры вопросов: выберите один, выберите несколько (мб выберите N?), напишите развёрнутый ответ, напишите запрос. Получается если вариантов ответа нет, то ответ проверяется преподавателем лично и уже потом студент получает полноценный ответ

**answer:** Содержит список ответов. Один и тот же ответ может принадлежать не только одному вопросу.

**question:** 1 к многим с theme. У вопроса есть собственно сам вопрос (тут на фронте наверное ещё добавить надо будет какой-нибудь prettify кода), к какой теме он относится и его сложность (надо что-то с этим хитрое придумать).

**question_type:** Многие к многим question & type. У одного вопроса может быть несколько различных вариантов ответа. Если "выберите один", то правильный ответ должен быть только один (или несколько? :D). В принципе, если выберите несколько, то можно дать возможность не выбирать ничего и это будет правильно, лол.

**question_answer:** Многие ко многим answer & question. В таблице указаны все возможные ответы, которые могут быть даны на заданный вопрос. Также есть атрибут is_true, который показывает, что ответ правильный. Получается, когда возвращаю список ответов мне надо узнать сколько вариантов мог выбрать пользователь, сколько он выбрал правильных.

### Таблицы с ответами пользователей (добавление информации пользователями)

**gen_question:** Какой вопрос выпал пользователю. Ссылка на question, session - каждой попутке пройти тест присваивается своя сессия, время, а также сгенерированный тип ответа на вопрос.

Алгоритм генерации вопроса следующий:

1. Получить список доступных для пользователя тем (проверить историю выданных вопросов), если в какой-то теме количество заданных вопросов = максимальному, то не брать эту тему

2. Получить список доступных вопросов (с учётом тем, исключая те вопросы, которые были уже заданы)

3. Выбрать случайным образом вопрос из доступных (возможно тут стоит добавить какую-то сложность?)

4. Для выбранного вопроса выбрать случайно тип ответа на этот вопрос

5. Для вопросов, на которые требуется выбрать варианты ответов генерируется собственно список этих вариантов ответа

6. Сгенерированный вопрос записывается в базу, сгенерированные ответы также записываются в базу (или ничего не записывается, если их нет)

**gen_answer:** Содержит список сгенерированных для пользователя ответов на сгенерированный вопрос.

См. выше

**user_answer:** Что по конкретному варианту ответа выбрал пользователь

Пользователь посылает запрос на API giveAnswer (или что-то такое). Из токена берётся его ID, ищется в базе вопрос, заданный ему (gen_question), на который не дано ответа ни в таблице user_answer, ни в таблице user_text_answer

**user_text_answer:** Таблица для тех вопросов, ответ на которых должен быть текстовым (код, самостоятельное описание). Тогда никаких сгенерированных вариантов ответа нет и ответ записывается в эту таблицу

См. выше

## API

### add question API

#### POST /api/admin/theme

Добавление новой темы и количества вопрос, максимальное количество которых может быть задано по этой теме

#### POST /api/admin/question

Добавление нового вопроса к теме

#### POST /api/admin/answer

Добавление нового ответа

#### POST /api/admin/type

Добавление нового типа ответов на вопроса (варианты ответа, текст и т.д.)

#### POST /api/admin/question_type

Добавление возможного типа ответов на вопрос

#### POST /api/admin/question_answer

Добавление ответа к вопросу

...

### user interaction API

#### GET /api/user/question

Получить вопрос, тип ответа на вопрос, сгенерированные ответы на вопрос. Вопрос не должен повторяться! API должно сохранить сгенерированный вопрос в gen_answer. Если ответ на вопрос состоит из вариантов ответа, то ещё в gen_answer должны добавиться сгенерированные варианты ответов. Если такого нет, то в user_text_answer уже не добавляется ничего.

#### POST /api/user/answer

Отправляется выбранный ответ на вопрос, insert в user_answer (если есть сгенрированный варианты ответов) или в user_text_answer (если нет сгенерированных вариантов ответа).

### Сессия для вопросов

Такая идея: когда пользователь кликает на "Начать тест", отправляется запрос на API, где генерится JWT токен (или просто md5), записывается в таблицу сессий (дата начала, дата конца). При каждом получении вопроса проверяется есть ли у пользователя активная (не истёкшая сессия). Если есть, то именно она берётся в gen_question session. Если пользователь пытается взять вопрос, а сессия истекла, то ему показывается результат. Если пользователь пытается взять следующий вопрос, сессия не истекла, то генерится следующий вопрос. Проверка только на моменте получения вопроса! Т.е. если пользователь взял за секунду до конца новый вопрос, то может отвечать на него сколько захочет по времени.
