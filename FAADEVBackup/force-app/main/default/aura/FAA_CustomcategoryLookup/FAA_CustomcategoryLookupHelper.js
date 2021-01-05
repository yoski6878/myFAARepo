({
	searchHelper : function(component,event,getInputkeyWord) {
	  // call the apex class method 
	  console.log('Hello!')
     var action = component.get("c.fetchLookUpValues");
        console.log('Hello 2!')
      // set param to method  
        action.setParams({
            'searchKeyWord': getInputkeyWord,
            'ObjectName' : component.get("v.objectAPIName")
          });
      // set a callBack    
        action.setCallback(this, function(response) {
          $A.util.removeClass(component.find("mySpinner"), "slds-show");
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                console.log('storeResponse',JSON.parse(storeResponse))
                /*let map = new Map();
                var fk = storeResponse.keys();
                for (x of fk) {
                    map.set(fk[x],x)
                }*/
                
              //  console.log('storeResponse',Object.keys(storeResponse))
              // if storeResponse size is equal 0 ,display No Result Found... message on screen.                }
                if (storeResponse.length == 0) {
                    component.set("v.Message", 'No Result Found...');
                } else {
                    component.set("v.Message", '');
                }
                // set searchResult list with return value from server.
                component.set("v.listOfSearchRecords", JSON.parse(storeResponse));
            }
 
        });
      // enqueue the Action  
        $A.enqueueAction(action);
    
	},
})