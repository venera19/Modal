
import "../css/less/style.less";
import '../../node_modules/pikaday/css/pikaday.css';
import * as moment from 'moment';
import * as Pikaday from 'pikaday';


const detectIE = () => {
    var ua = window.navigator.userAgent;     
    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }
    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      var rv = ua.indexOf('rv:');
      return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }
    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }      
    // other browser
    return false;
}   

const dateFormat = (inputDate, dateValue) => {          
    dateValue.className = "form-field__date"; 
    const substr = inputDate.value.match(/[a-z]+(?=\s[A-Z])/);
    dateValue.innerHTML = inputDate.value.replace(/[a-z]+(?=\s[A-Z])/, `<sup>${substr}</sup>`);        
}


function isIEEdgeInputs (parent)  {
    if (this.value.length) {           
        parent.querySelector('label').style.transform = "translateY(-10px) scale(.75)";
    } else {
        parent.querySelector('label').style.transform = "translateY(0) scale(1)";
    }
}


document.addEventListener("DOMContentLoaded", function () {  
    const isIEEdge = detectIE();
    const modalButton = document.querySelector('.js-open-modal');
    const overlay = document.querySelector('.js-overlay-modal');
    const closeButton = document.querySelector('.js-modal-close');
  

    modalButton.addEventListener('click', function (e) {
        e.preventDefault();
        const modalId = this.getAttribute('data-target');
        const modalElem = document.getElementById(modalId);
        modalElem.classList.add('active');
        overlay.classList.add('active');      
    });

    closeButton.addEventListener('click', function () {
        const parentModal = this.closest('.modal');
        parentModal.classList.remove('active');
        overlay.classList.remove('active');
    });

    document.body.addEventListener('keyup', function (e) {
        var key = e.keyCode;
        if (key == 27) {
            document.querySelector('.modal.active').classList.remove('active');
            document.querySelector('.overlay.active').classList.remove('active');
        };
    }, false);


    overlay.addEventListener('click', function() {
        document.querySelector('.modal.active').classList.remove('active');
        this.classList.remove('active');
    });



    const dateValue = document.createElement('div');
    const inputDate = document.getElementById('date');

    const pickerStart = new Pikaday({
        field: inputDate,
        defaultDate: moment().toDate(),
        setDefaultDate: true, 
        format: 'ddd Do MMMM'
    });

    dateFormat(inputDate, dateValue);
    inputDate.parentNode.append(dateValue);
    if (isIEEdge) inputDate.parentNode.querySelector('label').style.transform = "translateY(-10px) scale(.75)";

    inputDate.addEventListener('change', function() { 
        dateFormat(inputDate, dateValue);
    });
    



    const selects = document.querySelectorAll('.js-select');

    selects.forEach (item => {
        item.addEventListener('change', function() {  
            const div  = document.createElement('div');
            const parent = this.parentNode;
            div.className = "form-field__checkmark";
            parent.append(div);        
        })
    });


    const validFormat = (items, regExp) => {
        items.forEach (item => {
            item.addEventListener('change', function() { 
                const parent = this.parentNode;
          
                if (isIEEdge) isIEEdgeInputs.call(this, parent);
    
                const div  = document.createElement('div');               
                const notification  = parent.querySelector('.form-field__notification');
                const checkmark = parent.querySelector('.form-field__checkmark');
                const validText = parent.querySelector('.form-field__valid');
                if (this.value.match(regExp)) {               
                    if (notification) {
                        parent.removeChild(notification);
                        validText.innerHTML = '';
                    }
                    div.className = "form-field__checkmark js-mark";
                    parent.append(div);
                } else if  (this.value.length) {
                    if (checkmark) {
                        parent.removeChild(checkmark);                       
                    }
                    div.className = "form-field__notification js-mark";         
                    parent.append(div);                           
                    validText.innerHTML = "Invalid format";
                } else {
                    parent.removeChild(parent.querySelector('.js-mark')); 
                    validText.innerHTML = '';
                }
            })
        });
    }

    const inputNames = document.querySelectorAll('.js-input-name');
    const inputEmail = document.querySelectorAll('.js-input-email'); 

    validFormat(inputNames, /^[A-Za-z]{3,}$/);
    validFormat(inputEmail, /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/);



    const form = document.querySelector('.js-form-submit');
    
    form.addEventListener('submit', function(e) { 
        e.preventDefault();
        const notifications = document.querySelectorAll('.form-field__notification');
        if (notifications.length) return false;

        const formData = new FormData(form);
        const outputTitle = document.querySelector('.modal-form__title');
        outputTitle.style.color = "#db4433";
        
        fetch('/api', {            
            method: 'POST',
            mode: 'no-cors',
            body: formData
        })
        .then(response => {
            if (response.status !== 200) {           
                return Promise.reject();
            } 
            return response.text();
        })
        .then(data => {
            outputTitle.innerHTML = data;
            console.log(data);
        }).catch(() => {
            outputTitle.innerHTML = 'Request error!';
            console.log('Request error!')
        });; 
    });
});








