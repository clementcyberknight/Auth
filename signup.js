import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
      import {
        getFirestore,
        doc,
        setDoc,
      } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
      import {
        getAuth,
        createUserWithEmailAndPassword,
        signInWithPopup,
        GoogleAuthProvider,
      } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

      const firebaseConfig = {
        apiKey: "AIzaSyBOyOLGMWwMhWx37m5O6azSMEDnSljouzw",
        authDomain: "ulaitor.firebaseapp.com",
        projectId: "ulaitor",
        storageBucket: "ulaitor.appspot.com",
        messagingSenderId: "955585080394",
        appId: "1:955585080394:web:0e0fd633936fc4be794ab3"
      };
      

      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);


      const google_login = document.getElementById("google-signin");

      google_login.addEventListener("click", function(){
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const user = result.user;
                console.log('done')
                window.location.href = "home.html";
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                displayAlert(`Login failed: ${errorMessage}`);
            });
    });

      let signup_email = document.getElementById("signup_email");
      let signup_password = document.getElementById("signup_password");
      let signup_fullname = document.getElementById("signup_fullname");
      let signup_form = document.getElementById("signup_form");

      let RegisterUser = (evt) => {
        evt.preventDefault();
        spinner.style.display = "block";

        createUserWithEmailAndPassword(
          auth,
          signup_email.value,
          signup_password.value
        )
          .then(async (credentials) => {
            var ref = doc(db, "UserAuthList", credentials.user.uid);
            await setDoc(ref, {
              fullname: signup_fullname.value,
            });

            sessionStorage.setItem("userID", credentials.user.uid);
            sessionStorage.setItem("userFullname", signup_fullname.value);

            const messageDiv = document.createElement("div");
            messageDiv.className = "success-message";
            messageDiv.textContent = "User signed up successfully!";
            console.log("userID:", sessionStorage.getItem("userID"));
            console.log(
              "userFullname:",
              sessionStorage.getItem("userFullname")
            );

            document.body.appendChild(messageDiv);
            setTimeout(() => document.body.removeChild(messageDiv), 3000);
            window.location.href = "signup1.html";
            document.getElementById("signup_fullname").value = "";
            document.getElementById("signup_email").value = "";
            document.getElementById("signup_password").value = "";
            spinner.style.display = "none";
          })
          .catch((error) => {
            if (
              error.code === "auth/email-already-in-use" ||
              error.code === "auth/fullname-already-in-use"
            ) {
              displayAlert("User already exist.");
              spinner.style.display = "none";
            } else {
              displayAlert("Login failed: " + error.message);
              spinner.style.display = "none";
            }
            console.log(error.code, error.message);
          });
        function displayAlert(message) {
          const alertBox = document.getElementById("error_alert");
          alertBox.textContent = message;
          alertBox.classList.remove("hidden");

          // Optionally hide the alert after some time
          setTimeout(() => {
            alertBox.classList.add("hidden");
          }, 5000);
        }
      };

      signup_form.addEventListener("submit", RegisterUser);