$(document).ready(function() {
    
    var options;
    
    $.ajax ({
        dataType: "json",
        url: "./options.json",
        success: function(data) {
            options = data; 
            loadOptions ();
        }
    });
    
    function loadOptions (){

        var steps = $("form").children(".step"); 
        $(steps[0]).show();
        var current_step = 0; 

        $("button.next").click(function(){	
            changeColor(current_step);
            if($(steps[current_step]).find('input:invalid').length <= ''){
                if (current_step == steps.length-2) { 
                    $(this).hide(); 
                    $("button.edit").show(); 
                    $("form button.finish").show(); 
                }
                if (current_step ==  steps.length-3) { 
                    loadDepartments();
                }
                if (current_step >=  steps.length-2) { 
                    loadFilled();
                }
                current_step++; 
                changeStep(current_step); 
            };
        });
        $("button.edit").click(function(){
            if (current_step <= 2) { 
                $(this).hide(); 
            }
            $("form button.finish").hide(); 
            $("button.next").show(); 
            current_step = 0; 
            changeStep(current_step);
        });        
        $("button.finish").click(function(){	
            changeColor(current_step);
            if($(steps[current_step]).find('input:invalid').length <= ''){
                var data = {};
                $('form').find ('input, textearea, select').each(function(){
                    data[$(this).attr('id')] = $(this).val();  
                });

                var string = JSON.stringify(data);
                localStorage.setItem('data', string);
                $("form").hide(); 
                $(".message").show(); 
            };
        }); 
        function changeStep(i) { 
            $(steps).hide(); 
            $(steps[i]).show(); 
        };
        function changeColor(i){
            $(steps[i]).find("input:invalid").addClass("border-danger");
            $(steps[i]).find("input:valid").removeClass("border-danger");       
        };        
        function loadDepartments(){  
            var departments = '<option value="allDepartments">Departments</option>';
  
            for (department in options.departments) {
                departments += '<option value="' + department + '">' + department +'</option>';
            }
            $("#departments").html(departments);
            loadVacancies(department);
        };
        function loadVacancies(department){  
            var vacancies = '<option value="allVacancies">Vacancy</option>';
            
            for (vacancy in options.departments[department]) {
                vacancies += '<option value="' + vacancy + '">' + options.departments[department][vacancy] +'</option>'  
            }
            $("#vacancies").html(vacancies);
        };
        $("#departments").change(function(){
            var department = $(this).val();

            if (department == 'allDepartments'){
                $("#vacancies").prop('disabled',true);
            } else {
                $("#vacancies").prop('disabled',false);
            }

            loadVacancies(department);
        });
        function loadFilled(){
            $("#firstNameFilled").html($("#firstName").val());
            $("#loginFilled").html($("#login").val());
            $("#emailFilled").html($("#email").val());
            $("#companyFilled").html($("#company").val());
            $("#departmentsFilled").html($("#departments").val());
            $("#vacanciesFilled").html($("#vacancies option[value="+$("#vacancies").val()+"]"));
        }
        bootstrapValidate(['#firstName', '#lastName', '#login', '#email', '#password', '#conf-password'], 'required:Please fill out this field!');
        bootstrapValidate(['#firstName', '#lastName'], 'alpha:You can only input alphabetic characters');
        bootstrapValidate('#password', 'regex:^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{0,}:Password requires at least 1 lower case character, 1 upper case character, 1 number, 1 special character');
        bootstrapValidate('#email', 'email:Enter a valid E-Mail!');
        bootstrapValidate('#conf-password', 'matches:#password:Your passwords should match');
    };
});