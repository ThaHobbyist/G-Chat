/* eslint-disable */
<template>
    
<div class="container" id="container">
	<aside v-if="open">
		<header>
			<input type="text" id="mySearch" @change="search" @keyup="search" v-model="searchText" placeholder="search">
		</header>
		<ul v-if="searchText.trim().length === 0">
			<li v-for="usr in users" :key="usr.displayName" @click="openChat(usr)">
				<a>{{ usr.displayName }} </a>
			</li>
		</ul>
		<ul v-else>
			<li v-for="usr in searchResult" :key="usr.displayName" @click="openChat(usr)">
				<a>{{ usr.displayName }} </a>
			</li>
		</ul>
	</aside>
	<main v-if="show">
		<header >
			<button @click="toggle" >Toggle</button>
			<img :src = s_usr.photoURL  alt="">
			<div class="heading">
				<h2>Chat with {{ s_usr.displayName }}</h2>
			</div>
			<button @click="logout">logout</button>
		</header>
		<div class="messages" >
			<ul id="chat">
				<li v-for="(msg, index) in messages" :key="'index-'+index" :class="sentOrRecieved(msg.sender, msg.reciever)">
					<div class="message">
						<h3>{{ msg.text }}</h3>
					</div>
					<!--div class="entete" >
						<h3>{{ msg.createdAt }}</h3>
					</div-->
				</li>
			</ul>
		</div>
		<footer>
      		<form v-on:submit.prevent="sendMessage">
        		<input v-model="message" type="text" placeholder="Type your message"/>
        		<button :disabled="!message" type="submit"><img src="../assets/send_2.png" alt="send"/></button>
      		</form>
		</footer>
		<div ref="scrollable"></div>
	</main>
	<main class="text" v-else>
		<header>
			<button @click="toggle">Toggle</button>
			<button @click="logout">logout</button>
		</header>
		<h2>Select an User to chat with!</h2>
	</main>
</div>
</template>

<script>
import firebase from 'firebase'

  export default {
    mounted() {
        this.db.collection('messages').orderBy('createdAt')
            .onSnapshot( querySnap => {
                this.messages = querySnap.docs.map(doc => doc.data())
				console.log(this.messages)
            })
        this.db.collection('users').where("email", "!=", this.user.email)
            .onSnapshot( querySnap => {
                this.users = querySnap.docs.map(doc => doc.data())
                console.log(this.users)
            })	
		console.log(this.user)
    },
    data() {
        return {
          user: localStorage.getItem("user"),
          db: firebase.firestore(),
          message: '',
          messages: [],
		  view_messages: [],
          users: [],
          s_usr: [],
		  searchResult: [],
		  searchText: "",
		  show: false,
		  open: true,
        }
    },
    methods: {
		toggle(){
			this.open = !this.open
		},
        async sendMessage() {

          const messageInfo = {
            'sender': this.user.uid,
            'reciever': this.s_usr.userUID,
            'displayName': this.user.displayName,
            'photoURL': this.user.photoURL,
            'text': this.message,
            'createdAt': Date.now(),
          }

          await this.db.collection('messages').add(messageInfo)

          this.message = ''
          this.$refs['scrollable'].scrollIntoView({ behaviour: 'smooth'})
          
        },
        sentOrRecieved(senderID, recieverID) {
          if (senderID == this.s_usr.userUID && recieverID == this.user.uid){
            return "you"
          }
          else if (senderID == this.user.uid && recieverID == this.s_usr.userUID){
            return "me"
          }
		  else {
			return "none"
		  }
        },
        openChat(user) {
          	this.s_usr = user
        	console.log(user.email)
			this.show = true
        },
        print(user) {
          console.log(user)
        },
		logout() {
            firebase.auth().signOut().then(
                () => {
					console.log("works")
                }).catch((error) => {
                    console.log(error.message)
					console.log("error")
                })
			this.$router.replace('/')
        },
		search() {
			console.log(this.searchText)
			this.users.map((usr) => {
				if (usr.displayName.toLowerCase().includes(this.searchText) ){
					this.searchT = true
					this.searchResult = []
					this.searchResult.push(usr)
				}
				
			})
		}
    },
  }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Overlock+SC&display=swap');

*{
    box-sizing: border-box;
}

form.example input[type=text] {
  padding: 10px;
  font-size: 17px;
  border: 1px solid grey;
  float: left;
  width: 70%;
  background: #f1f1f1;
}

/* Style the submit button */
form.example button {
  float: right;
  width: 10%;
  padding: 10px;
  background: #2196F3;
  color: white;
  font-size: 17px;
  border: 1px solid grey;
  border-left: none; /* Prevent double borders */
  cursor: pointer;
}

form.example button:hover {
  background: #0b7dda;
}

/* Clear floats */
form.example::after {
  content: "";
  clear: both;
  display: table;
}

*{
	box-sizing:border-box;
}
body{
	background-color:#abd9e9;
	font-family:Arial;
	width: 100%;
}
#container{
	width:100%;
	height:100%;
	background:rgba(224, 224, 224, 0.808);
	margin:0 auto;
	font-size:0;
	border-radius:5px;
	overflow:hidden;
	border: 2px solid #3b3e49;
}
aside{
	width:20%;
	height:100%;
	background-color:#3b3e49;
	display:inline-block;
	font-size:15px;
	vertical-align:top;
	overflow: hidden;
}
main{
	width:80%;
	height:100%;
	display:inline-block;
	font-size:15px;
	vertical-align:top;
}

aside header{
	padding:30px 20px;
}
aside input{
	width:100%;
	height:50px;
	line-height:50px;
	padding:0 50px 0 20px;
	background-color:#5e616a;
	border:none;
	border-radius:3px;
	color:#fff;
	background-image:url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/ico_search.png);
	background-repeat:no-repeat;
	background-position-x: right;
	background-position-y: center;
	background-size:40px;
}
aside input::placeholder{
	color:#fff;
}
aside ul{
	padding-left:0;
	margin:0;
	list-style-type:none;
	overflow-y:scroll;
	height:690px;
}
aside li{
	padding:10px 10px;
	font-family: Boogaloo, cursive;
	font-size: 25px;
}
aside li:hover{
	background-color:#5e616a;
}

aside li img{
	border-radius:50%;
	margin-left:20px;
	margin-right:8px;
}
aside li div{
	display:inline-block;
	vertical-align:top;
	margin-top:12px;
}
aside li h2{
	font-size:14px;
	color:#fff;
	font-weight:normal;
	margin-bottom:5px;
}
aside li h3{
	font-size:12px;
	color:#7e818a;
	font-weight:normal;
}

.status{
	width:8px;
	height:8px;
	border-radius:50%;
	display:inline-block;
	margin-right:7px;
}
.green{
	background-color:#58b666;
}
.orange{
	background-color:#ff725d;
}
.blue{
	background-color:#6fbced;
	margin-right:0;
	margin-left:7px;
}
.text{
	background-color: none;
	text-align: center;
}

.text h2{
	font-family: Rowdies, cursive;
	vertical-align: middle;
}

main #chat{
	background-image: url("../assets/chat_1.png");
}
main header button {
	font-family: 'Overlock SC', cursive;
	float: right;
	font-size: 20px;
	border: none;
	background-color: rgba(255, 255, 255, 0.596);
	cursor: pointer;
	border: 1px solid rgba(128, 128, 128, 0.521);
	text-align: center;
	vertical-align: center;

}

main header{
	height:110px;
	padding:30px 20px 30px 40px;
}
main header > *{
	display:inline-block;
	vertical-align:top;
}
main header img:first-child{
	border-radius:50%;
	width: 50px;
	vertical-align: middle;
}
main header img:last-child{
	width:12px;
	margin-top:8px;
}
main header div{
	margin-left:10px;
	margin-right:145px;
	vertical-align: middle;
}
main header h2{
	font-family: Rowdies, cursive;
	font-size:16px;
	margin-bottom:5px;
}
main header h3{
	font-size:14px;
	font-weight:normal;
	color:#7e818a;
}
#chat::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
#chat {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

#chat{
	padding-left:0;
	margin:0;
	list-style-type:none;
	overflow-y:scroll;
	height:535px;
	border-top:2px solid #fff;
	border-bottom:2px solid #fff;
}
#chat li{
	padding:10px 10px;

}
#chat h2,#chat h3{
	display:inline-block;
	font-family: 'Patrick Hand', cursive;
	font-size: 18px;
	font-weight:normal;
}
#chat h3{
	color:rgb(255, 254, 254);
}
#chat .entete{
	margin-bottom:5px;
}
#chat .message{
	padding:10px 20px;
	color:#fff;
	line-height:10px;
	max-width:90%;
	display:inline-block;
	text-align:left;
	border-radius:40px;
	
}
#chat .me{
	text-align:right;
}
#chat .you .message{
	background-color:#58b666;
}
#chat .me .message{
	background-color:#6fbced;
}
#chat .none{
	display: none;
}


main footer{
	height:155px;
	padding:20px 30px 10px 20px;
}
main footer input{
	resize:none;
	border:none;
	display:block;
	width:90%;
	float: left;
	height:80px;
	border-radius:3px;
	padding:20px;
	font-size:18px;
	margin-bottom:13px;
}
main footer input::placeholder{
	color:rgb(146, 146, 146);
}

main footer button{
	background-color: rgba(255, 255, 255, 0.404);
	border: 0;
	border-radius: 3px;
	vertical-align:middle;
	margin-top:5px;
	float: right;
	padding: 0;
	cursor: pointer;
}

main footer button:focus{
	background-color: rgba(199, 199, 199, 0.856);
}

main footer img{
	width: 40px;
	height: 40px;
	padding: 0;
}

@media screen and (max-width: 540px) {
#container {
    margin: auto;
    height: 97.5vh;
	vertical-align: middle;
}
}

</style>