public class FAA_CatagorySearchController {
    
    public static void getCases(Id caseRecID){
        
        List<case> getCase = [select id from case where ID =: caseRecID];
        
        
    }

}