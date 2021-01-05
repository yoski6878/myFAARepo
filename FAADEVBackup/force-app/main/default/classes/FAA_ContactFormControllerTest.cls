@isTest
public class FAA_ContactFormControllerTest {
    static testMethod void faacontactformtest() {
        FAA_ContactFormController.getPicklistvalues('case','status',true);
        /*Contact con = new Contact();
        con.firstname='test';
        con.lastname='contact';
        con.email='test@test.com'; */
        
        RecordType personAccountRecordType =  [SELECT Id FROM RecordType WHERE Name = 'FAA Account' and SObjectType = 'Account'];
		Account newPersonAccount = new Account();
		newPersonAccount.FirstName = 'test';
 		newPersonAccount.LastName = 'contact';
        newPersonAccount.PersonEmail ='test@test.com';
 		newPersonAccount.RecordType = personAccountRecordType;
 		insert newPersonAccount;
        //FAA_ContactFormController.saveContact(con);
        case cs = new case();
        cs.subject ='test';
        cs.description='test';
        case insertedcase=FAA_ContactFormController.submitCase(cs,newPersonAccount);
        //case insertedcase=FAA_ContactFormController.saveCase(cs,con.Id);
        FAA_ContactFormController.searchCase(insertedcase.casenumber,'test@test.com');
        //FAA_ContactFormController.submitCase(cs,con);
        //FAA_ContactFormController.saveContact(con);
    }
}