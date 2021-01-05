({
	doInit: function(component, event, helper) {
       var action = component.get('c.getCases');
        var self = this;
        action.setCallback(this, function(Result) {
            component.set('v.Case', Result.getReturnValue());
        });
        $A.enqueueAction(action);
    },
})