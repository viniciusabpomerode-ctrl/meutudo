(function(){
  var picker=document.getElementById('course-language');
  if(!picker)return;
  picker.addEventListener('change',function(){
    var n=picker.dataset.lesson;
    localStorage.setItem('afb_language',picker.value);
    location.href='/'+picker.value+'/german-a1-course/'+(n?('lesson-'+String(n).padStart(2,'0')+'.html'):'');
  });
})();
