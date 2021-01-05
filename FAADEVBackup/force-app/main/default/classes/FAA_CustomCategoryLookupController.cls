public class FAA_CustomCategoryLookupController {
    @AuraEnabled
    public static string  fetchLookUpValues(String searchKeyWord, String ObjectName) {
        /*system.debug('ObjectName-->' + ObjectName);
        String searchKey = '%'+searchKeyWord + '%';
        
        List < sObject > returnList = new List < sObject > ();
        
        // Create a Dynamic SOQL Query For Fetch Record List with LIMIT 5   
        String sQuery =  'select id, Name from ' +ObjectName + ' where Name LIKE: searchKey order by createdDate DESC limit 5';
        List < sObject > lstOfRecords = Database.query(sQuery);
        
        for (sObject obj: lstOfRecords) {
            returnList.add(obj);
        }*/
        list<wrapper> listwrpper = new list<wrapper>();
        Map<String,String> mapofdependentvalues= new map<string,string>();
        for(String ind :  getDependentPicklistValues(Case.FAA_Sub_Catagories__c ).keySet()){
            
            for(String inx : getDependentPicklistValues(Case.FAA_Sub_Catagories__c ).get(ind)){
                if(inx.contains(searchKeyWord)){
                    mapofdependentvalues.put(inx,ind); 
                    wrapper wrp = new wrapper();
                    wrp.key = inx;
                    wrp.value = ind;
                    listwrpper.add(wrp);
                }
            }
            
        }
        system.debug(mapofdependentvalues);
        return JSON.serialize(listwrpper);
    }
    
    public static Map<String, List<String>> getDependentPicklistValues(Schema.sObjectField dependToken) {
        Schema.DescribeFieldResult depend = dependToken.getDescribe();
        Schema.sObjectField controlToken = depend.getController();
        if (controlToken == null) {
            return new Map<String, List<String>>();
        }
        
        Schema.DescribeFieldResult control = controlToken.getDescribe();
        List<Schema.PicklistEntry> controlEntries;
        if(control.getType() != Schema.DisplayType.Boolean) {
            controlEntries = control.getPicklistValues();
        }
        
        String base64map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        Map<String,List<String>> dependentPicklistValues = new Map<String,List<String>>();
        for (Schema.PicklistEntry entry : depend.getPicklistValues()) {
            if (entry.isActive() && String.isNotEmpty(String.valueOf(((Map<String,Object>) JSON.deserializeUntyped(JSON.serialize(entry))).get('validFor')))) {
                List<String> base64chars =
                    String.valueOf(((Map<String,Object>) JSON.deserializeUntyped(JSON.serialize(entry))).get('validFor')).split('');
                for (Integer index = 0; index < (controlEntries != null ? controlEntries.size() : 2); index++) {
                    Object controlValue =
                        (controlEntries == null
                         ?   (Object) (index == 1)
                         :   (Object) (controlEntries[index].isActive() ? controlEntries[index].getLabel() : null)
                        );
                    Integer bitIndex = index / 6;
                    if (bitIndex > base64chars.size() - 1) {
                        break;
                    }
                    Integer bitShift = 5 - Math.mod(index, 6);
                    if  (controlValue == null || (base64map.indexOf( base64chars[ bitIndex ] ) &(1 << bitShift)) == 0)
                        continue;
                    if (!dependentPicklistValues.containsKey((String) controlValue)) {
                        dependentPicklistValues.put((String) controlValue, new List<String>());
                    }
                    dependentPicklistValues.get((String) controlValue).add(entry.getLabel());
                }
            }
        }
        return dependentPicklistValues;
    }
    
    @AuraEnabled
    public static void updatecase( Id recordIdnew,String subcategory,String category){
        system.debug('recordIdnew'+recordIdnew);
        system.debug('category'+category);
        system.debug('subcategory'+subcategory);
        
        Case rec = new Case();
        rec.id = recordIdnew;
        rec.FAA_Sub_Catagories__c  = subcategory;
        rec.FAA_Category__c  = category;
        update rec;
    }
    
    
    public class wrapper {
        public string key;
        public string value;
    }
}