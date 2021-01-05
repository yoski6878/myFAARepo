({
    fetchCategoryPicklist : function(component){
        var action = component.get("c.getPicklistvalues");
        action.setParams({
            'objectName': 'Case',
            'field_apiname': 'FAA_Demographic__c',
            'nullRequired': false // doesn't includes --None--
        });
        action.setCallback(this, function(a) {
            var state = a.getState();
            if (state === "SUCCESS"){
                component.set("v.demographicPicklist", a.getReturnValue());
                console.log('first val: '+a.getReturnValue()[0]);
                component.set("v.newCase.FAA_Demographic__c",a.getReturnValue()[0]);
            } 
        });
        $A.enqueueAction(action);
    }, 
    validateFormDetails: function(component) {
        // Show error messages if required fields are blank
        var allValid=false;
        var contactValid = component.find('contactField').reduce(function (validFields, inputCmp) {
            inputCmp.showHelpMessageIfInvalid();
            return validFields && inputCmp.get('v.validity').valid;
        }, true);
        var caseValid = component.find('caseField').reduce(function (validFields, inputCmp) {
            inputCmp.showHelpMessageIfInvalid();
            return validFields && inputCmp.get('v.validity').valid;
        }, true);

        if(contactValid && caseValid)
         allValid =true;
        else 
         allValid =false;
        
        return(allValid);
    },
    saveCase: function(component,contactId) {
        var saveCaseAction = component.get("c.saveCase");
            saveCaseAction.setParams({
                "caseRecord": component.get("v.newCase"),
                "contactId": contactId
            });
            saveCaseAction.setCallback(this, function(response) {
                var state = response.getState();
                component.set("v.loading",false);
                if(state === "SUCCESS") {
                 // Prepare a toast UI message
                    console.log('case created.'+JSON.stringify(response.getReturnValue()));
                    var resultsToast = $A.get("e.force:showToast");
                    resultsToast.setParams({
                        "title": "Case Created",
                        "type": "success",
                        "message": "Case created successfully with case# "+response.getReturnValue().CaseNumber
                    });
                    resultsToast.fire();
                    if(response.getReturnValue().CaseNumber != null)
                     component.set("v.caseNumber", response.getReturnValue().CaseNumber);
                    
                }
                else if (state === "ERROR") {
                    console.log('Problem saving case, response state: ' + state+response.getError()[0].message);
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.log("Error message: " + 
                                    errors[0].message);
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
                else {
                    console.log('Unknown problem, response state: ' + state);
                }
            });
 
            $A.enqueueAction(saveCaseAction);
    }
})