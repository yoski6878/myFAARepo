import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import searchCase from '@salesforce/apex/FAA_ContactFormController.searchCase';

export default class FAA_StatusInquiry extends LightningElement {
    caseNumber;
    contactEmail;
    caseRecordFound;
    _showSpinner=false;
    variant;

    handleFieldChange(event){
        this[event.target.name] = event.target.value;
    }
    
    searchCaseRecord(){
        this.caseRecordFound='';
        const allValid = [...this.template.querySelectorAll('lightning-input')]
            .reduce((validSoFar, inputCmp) => {
                        inputCmp.reportValidity();
                        return validSoFar && inputCmp.checkValidity();
            }, true);
            
        if (allValid) {
            this._showSpinner=true;
            searchCase({ caseNumber: this.caseNumber,contactEmail: this.contactEmail })
            .then((result) =>{
                console.log('result: '+JSON.stringify(result));
                this._showSpinner=false;
                if(result!= null)
                 this.caseRecordFound=result;
                else{
                    const evt = new ShowToastEvent({
                        title: 'Error',
                        message: 'Case not found with the above details.',
                        variant: 'error'
                    });
                    this.dispatchEvent(evt);
                }
            })
            .catch((error) =>{
                console.log('error: '+error.body.message)
                this._showSpinner=false;
                const evt = new ShowToastEvent({
                    title: 'Error',
                    message: 'Case not found with the above details.',
                    variant: 'error'
                });
                this.dispatchEvent(evt);
            });
        } else {
            const evt = new ShowToastEvent({
                title: 'Warning',
                message: 'Please provide required details.',
                variant: 'warning'
            });
            this.dispatchEvent(evt);
        }
    }
}