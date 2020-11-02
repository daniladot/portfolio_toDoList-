let Data = [];

const dataPicker = () => {
    document.addEventListener('DOMContentLoaded', function () {
        var elems = document.querySelectorAll('.datepicker');
        M.Datepicker.init(elems, { format: 'dd mm yyyy' });
        console.log(elems);
    });
}

const getData = () => {
    Data = JSON.parse(localStorage.getItem('task')) || [];
}

const setData = () => {
    if (localStorage.getItem('task'))
        localStorage.setItem('task', JSON.stringify(Data));
}

const timePicker = () => {
    document.addEventListener('DOMContentLoaded', function () {
        var elems = document.querySelectorAll('.timepicker');
        M.Timepicker.init(elems, { twelveHour: false });
    });
}

const dataSort = () => {
    
    if (Data.length > 1){
    Data.forEach((item, ) => {
        console.log(item.date)
        item.valueForSort = item.date.split(' ')[2] * 365 + item.date.split(' ')[1] * 30 + +(item.date.split(' ')[0]) + item.time.split(':').join('');
    })
        Data.sort((prev, next) => next.valueForSort - prev.valueForSort)
        setData();
        renderCard();
    }
}

const addTaskData = () => {

    $('a').on("click", function () {

        if ($('.datepicker').val() != "" && $('.task-inp').val() != "" && $('.timepicker').val() != "") {

            Data.push(
                {
                    date: $('.datepicker').val(), time: $('.timepicker').val(),
                    task: $('.task-inp').val(),
                    valueForSort: document.querySelector('.datepicker').value.split(' ')[2] * 365 + document.querySelector('.datepicker').value.split(' ')[1] * 30 + +(document.querySelector('.datepicker').value.split(' ')[0]) + document.querySelector('.timepicker').value.split(':').join('')
                },
            )

            dataSort();
        }
        localStorage.setItem('task', JSON.stringify(Data));
        renderCard();
    })
}

const renderCard = () => {
    $('.tasks').html("");   
    getData();
    //getData();

    Data.forEach(item => {
        console.log(item)

        $('.tasks').append(`
        <div class="task col s12">
        <hr>
        <div class="date col s2"> Date: ${item.date}</div>
        <div class="time col s3">Time: ${item.time}</div>
        <div class="name col s3 ">Task: ${item.task}</div>
            <i class="edit fa fa-pencil col s1 offset-s1" aria-hidden="true"></i>
            <i class="remove fa fa-times col s1" aria-hidden="true"></i>
    </div>`);

    

    })
    editCard();
    removeCard();
}

const removeCard = () => {
    document.querySelectorAll('.remove').forEach((item, index) => {
        item.onclick = function () {
            Data.splice(index, 1);
            setData();
            renderCard();
        }
    })
}

const editCard = () => {
    let switcher = false;
    document.querySelectorAll('.edit').forEach((item,index) => {
        item.onclick = function(){
            if (switcher == false) {
                switcher = true;
                let time = this.parentElement.childNodes[5].textContent.split(" ")[1];
                let date = this.parentElement.childNodes[3].textContent.split(":")[1];
                let text = this.previousSibling.previousSibling.textContent.split(':')[1];
                $(this).siblings('.date').html(`Date : <input type="text" placeholder="input date" class="datepicker datepicker-new" value="${date}">`);
                $(this).siblings('.time').html(`Time : <input type="text" placeholder="input time" class="timepicker timepicker-new" value="${time}">`);
                $(this).siblings('.name').html(`Task : <textarea class="edit-text">${text}</textarea>`);
                $('.datepicker-new').on('mousedown', function () {
                    var elemsDate = document.querySelectorAll('.datepicker');
                    M.Datepicker.init(elemsDate, { format: 'dd mm yyyy' });
                });
                $('.timepicker-new').on('mouseenter', function () {
                    var elemsTime = document.querySelectorAll('.timepicker');
                    M.Timepicker.init(elemsTime, { twelveHour: false });
                });
                                
            } else {
                let newDate = $.trim($('.datepicker-new').val());
                let newTime = $.trim($('.timepicker-new').val());
                let newText = $.trim($('.edit-text').val());
                
                $(this).siblings('.date').html(`<div class="date"> Date: ${newDate}</div>`);
                $(this).siblings('.time').html(`<div class="time">Time: ${newTime}</div>`);
                $(this).siblings('.name').html(`<div class="name">Task:${newText}</div>`)
                
                Data[index].date = newDate;
                Data[index].time = newTime;
                Data[index].task = newText;

                switcher = false;
                setData();
                dataSort();
            }    
        }
    })
}

dataPicker();
timePicker();
addTaskData();
renderCard();