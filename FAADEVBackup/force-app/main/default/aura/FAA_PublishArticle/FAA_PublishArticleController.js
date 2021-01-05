({
    doInit : function(component, event, helper) {
        component.set("v.loading",true);
        component.set("v.flagAsNew",false);
        var checkDataCategoryAction = component.get("c.checkDataCategoryAssignedToArticle");
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        
        today = yyyy + '-' + mm + '-' + dd;
        console.log('today: '+today);
        
        component.set("v.todaysDate",today);
        checkDataCategoryAction.setParams({
                "articleId": component.get("v.recordId")
            });
            checkDataCategoryAction.setCallback(this, function(response) {
                var state = response.getState();
                component.set("v.loading",false);
                if(state === "SUCCESS") {
                     console.log('check data category '+response.getReturnValue());
                     if(response.getReturnValue() != null){
                        component.set("v.articleTitle",response.getReturnValue().Parent.Title);
                        component.set("v.isDataCategoryMapped",true);
                     }
                     else
                      component.set("v.isDataCategoryMapped",false);
                      
                     /*if(component.get("v.isDataCategoryMapped")){
                        $A.get("e.force:closeQuickAction").fire();
                        $A.get('e.force:refreshView').fire();
                     }
                    else
                      $A.get("e.force:closeQuickAction").fire();*/
                }
                else if (state === "ERROR") {
                    console.log('Error state: ' + state);
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.log("Error message: " + errors[0].message);
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
                else {
                    console.log('Unknown problem, response state: ' + state);
                }
            });
            $A.enqueueAction(checkDataCategoryAction);
    },
    publishData: function(component, event, helper) {
        component.set("v.loading",true);
        console.log('record Id : '+component.get("v.recordId"));
        console.log('date : '+component.get("v.scheduleddate"));
        console.log('flag : '+component.get("v.flagAsNew"));
        if(component.get("v.value") == 'now' || (component.get("v.value") == 'schedule' && component.find("schDate").reportValidity() )){
            var pubArticle = component.get("c.publishArt");
            pubArticle.setParams({
                "knowledgeArticleId": component.get("v.recordId"),
                "scheduledate":component.get("v.scheduleddate"),
                "flagasnew":component.get("v.flagAsNew")
            });
            pubArticle.setCallback(this, function(response) {
                var state = response.getState();
                component.set("v.loading",false);
                if(state === "SUCCESS") {
                     console.log('publish response: '+response.getReturnValue());
                     var resultsToast = $A.get("e.force:showToast");
                     if(component.get("v.value") == "now"){
                        resultsToast.setParams({
                            "type": "success",
                            "message": 'Success! "'+component.get("v.articleTitle")+'" has been published.'
                         });
                     }
                     else{
                         var dateObj = new Date(component.get("v.scheduleddate"));
                         dateObj.setDate(dateObj.getDate() + 1)
                         console.log('date: '+dateObj);
                         resultsToast.setParams({
                            "type": "success",
                            "message": "Scheduled Publication Date "+dateObj.toDateString()
                         });
                     }
                     
                     resultsToast.fire();
                     $A.get("e.force:closeQuickAction").fire();
                     $A.get('e.force:refreshView').fire();
                }
                else if (state === "ERROR") {
                    console.log('Error state: ' + state);
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.log("Error message: " + errors[0].message);
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
                else {
                    console.log('Unknown problem, response state: ' + state);
                }
            });
            $A.enqueueAction(pubArticle);
        }
        else{
            component.set("v.loading",false);
            return;
        }
         
                 
        
    },
    cancel : function(component, event, helper){
        $A.get("e.force:closeQuickAction").fire();
    },
    handleRadioChange: function(component, event, helper) {
        if(component.get("v.value") !='now'){
            console.log('in change');
            //component.set("v.flagAsNew",true);
            component.set("v.scheduleddate",null);
        }
        else
        component.set("v.flagAsNew",true);
         
    }
    
})