<aura:application extends="force:slds">
    <aura:attribute name="selectedLookUpRecord" type="sObject" default="{}"/>
    <aura:attribute name="objContact" type="contact" default="{'sobjectType':'contact'}"/>
  
  <div class="slds-m-around_large">
 
      <c:FAA_CustomcategoryLookup objectAPIName="account" IconName="standard:category" label="Sub-Category" selectedRecord="{!v.selectedLookUpRecord}"/>
      
<br/> 
    </div>
</aura:application>