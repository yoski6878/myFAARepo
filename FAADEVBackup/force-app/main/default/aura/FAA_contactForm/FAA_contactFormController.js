({
    doInit: function(component, event, helper) {
        helper.fetchCategoryPicklist(component); // fetches PickList Values of Category Field
    },
    //code commented for case deflection
    itemsChange : function(component, event, helper) {           
           /*var appEvent = $A.get("e.selfService:caseCreateFieldChange");
           console.log('fieldName: '+event.getSource().get("v.name"));
           appEvent.setParams({
               //"modifiedField": event.getSource().get("v.fieldName"),
               "modifiedField": event.getSource().get("v.name"),
               "modifiedFieldValue": event.getSource().get("v.value")
           });
           appEvent.fire();*/
    },
    submit : function(component, event, helper) {
        //var formFields = event.getParam("fields");
        //console.log('field values: '+JSON.stringify(formFields));
        //event.preventDefault();
        if(helper.validateFormDetails(component)) {
            component.set("v.loading",true);
            console.log('contact details: '+JSON.stringify(component.get("v.newAccount")));
            var saveContactAction = component.get("c.saveContact");
            saveContactAction.setParams({
                "contact": component.get("v.newAccount")
            });
            saveContactAction.setCallback(this, function(response) {
                var state = response.getState();
                if(state === "SUCCESS") {
                 // Prepare a toast UI message
                    var contactId=response.getReturnValue().Id;
                    console.log('contact created'+contactId);
                    helper.saveCase(component,contactId);
                }
                else if (state === "ERROR") {
                    console.log('Problem saving contact, response state: ' + state+response.getError()[0].message);
                    component.set("v.loading",false);
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
 
            $A.enqueueAction(saveContactAction);
        }
        else{
            var resultsToast = $A.get("e.force:showToast");
            resultsToast.setParams({
                "title": "Warning",
                "type": "warning",
                "message": "Please fill required fields."
            });
            resultsToast.fire();
        }
    },
    submitNew : function(component, event, helper) {
        //var formFields = event.getParam("fields");
        //console.log('field values: '+JSON.stringify(formFields));
        //event.preventDefault();
        if(helper.validateFormDetails(component)) {
            component.set("v.loading",true);
            console.log('contact details: '+JSON.stringify(component.get("v.newAccount")));
            var saveContactAction = component.get("c.submitCase");
            saveContactAction.setParams({
                "caseRecord": component.get("v.newCase"),
                "account": component.get("v.newAccount")
            });
            saveContactAction.setCallback(this, function(response) {
                var state = response.getState();
                component.set("v.loading",false);
                if(state === "SUCCESS") {
                 // Prepare a toast UI message
                    var caseId=response.getReturnValue().Id;
                    console.log('case created'+caseId);
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
                    console.log('Problem saving case, state: ' + state);
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.log("Error message: " + errors[0].message);
                            var resultsToast = $A.get("e.force:showToast");
                            resultsToast.setParams({
                                "title": "Error",
                                "type": "error",
                                "message": "Error creating case: "+errors[0].message
                            });
                            resultsToast.fire();
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
                else {
                    console.log('Unknown problem, response state: ' + state);
                }
            });
 
            $A.enqueueAction(saveContactAction);
        }
        else{
            var resultsToast = $A.get("e.force:showToast");
            resultsToast.setParams({
                "title": "Warning",
                "type": "warning",
                "message": "Please fill required fields."
            });
            resultsToast.fire();
        }
    }

})