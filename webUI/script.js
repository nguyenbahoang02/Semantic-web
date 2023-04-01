// MESSAGE INPUT
const textArea = document.querySelector('.chatbox-message-input')
const chatboxForm = document.querySelector('.chatbox-message-form')

textArea.addEventListener('input', function () {
	let line = textArea.value.split('\n').length

	if(textArea.rows < 6 || line < 6) {
		textArea.rows = line
	}

	if(textArea.rows > 1) {
		chatboxForm.style.alignItems = 'flex-end'
	} else {
		chatboxForm.style.alignItems = 'center'
	}
})



// TOGGLE CHATBOX
const chatboxToggle = document.querySelector('.chatbox-toggle')
const chatboxMessage = document.querySelector('.chatbox-message-wrapper')

chatboxToggle.addEventListener('click', function () {
	chatboxMessage.classList.toggle('show')
})






// CHATBOX MESSAGE
const chatboxMessageWrapper = document.querySelector('.chatbox-message-content')
const chatboxNoMessage = document.querySelector('.chatbox-message-no-message')

chatboxForm.addEventListener('submit', function (e) {
	e.preventDefault()

	if(isValid(textArea.value)) {
		writeMessage()
	}
})



function addZero(num) {
	return num < 10 ? '0'+num : num
}

function writeMessage() {
	const today = new Date()
	let message = `
		<div class="chatbox-message-item sent">
			<span class="chatbox-message-item-text">
				${textArea.value.trim().replace(/\n/g, '<br>\n')}
			</span>
			<span class="chatbox-message-item-time">${addZero(today.getHours())}:${addZero(today.getMinutes())}</span>
		</div>
	`
    sendToRasaServer(textArea.value.trim().replace(/\n/g, '<br>\n'))
	chatboxMessageWrapper.insertAdjacentHTML('beforeend', message)
	chatboxForm.style.alignItems = 'center'
	textArea.rows = 1
	textArea.focus()
	textArea.value = ''
	chatboxNoMessage.style.display = 'none'
	scrollBottom()
}

function setBotReply(reply) {
	const today = new Date()
    let msg=''
    let array=[]
    for(x in reply) {
        array.push(reply[x].text)
    }
    msg = array.join('<br>')
	let message = `
		<div class="chatbox-message-item received">
			<span class="chatbox-message-item-text">
				${msg}
			</span>
			<span class="chatbox-message-item-time">${addZero(today.getHours())}:${addZero(today.getMinutes())}</span>
		</div>
	`
	chatboxMessageWrapper.insertAdjacentHTML('beforeend', message)
	scrollBottom()
}

function scrollBottom() {
	chatboxMessageWrapper.scrollTo(0, chatboxMessageWrapper.scrollHeight)
}

function isValid(value) {
	let text = value.replace(/\n/g, '')
	text = text.replace(/\s/g, '')

	return text.length > 0
}

function sendToRasaServer(text){
    $.ajax({
        type : 'POST',
        url : 'http://localhost:5005/webhooks/rest/webhook',
        contentType: 'application/json',
        data : JSON.stringify({
            "sender" : "user",
            "message" : text
        }),
        success : function(reply, status){
            if(reply!=null){
                setBotReply(reply)
                // console.log(reply)
            }
        }
    })
}