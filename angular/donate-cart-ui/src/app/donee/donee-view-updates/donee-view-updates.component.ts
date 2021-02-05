import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

import { DoneeService } from '../donee.service';
import {Subscription} from 'rxjs'
import { DoneeUpdate } from 'src/app/model/donee-update';
import {RequirementUpdate} from '../../model/requirement-update';
@Component({
  selector: 'app-donee-view-updates',
  templateUrl: './donee-view-updates.component.html',
  styleUrls: ['./donee-view-updates.component.css']
})
export class DoneeViewUpdatesComponent implements OnInit {

  constructor(private authService:AuthService,private doneeService:DoneeService) { }
  
 baseUrlForImage = "http://127.0.0.1:5000/";
 doneeUpdates:DoneeUpdate[]=[];
 doneeUpdatesChanged:Subscription;
  showModal :boolean = false;
 selectedReqUpdates:RequirementUpdate[]=[];
 visibleReqUpdate:boolean[]=[]; //check which item's updates are being viewed
  
 reqIdx:number = null;
 updateIdx:number = null;
 messageBody:string = "";
  loadingFlag:boolean = null;
  

  ngOnInit(): void {
    this.getDoneeUpdates()
  
  }
  getDoneeUpdates(){
    this.doneeUpdates=this.doneeService.getDoneeUpdates()
  
    //clear flag array first
    this.visibleReqUpdate.length  = 0;
      //set view flags for each item's updates to be false
      for(var i =0;i<this.doneeUpdates.length;i++){
        this.visibleReqUpdate.push(false)
      }
  
    this.doneeUpdatesChanged= this.doneeService.doneeUpdatesChanged.subscribe((data:DoneeUpdate[])=>{
      this.doneeUpdates=data; //get Donor Updates
      //clear flag array first
      this.visibleReqUpdate.length  = 0;
      //set view flags for each item's updates to be false
      for(var i =0;i<this.doneeUpdates.length;i++){
        this.visibleReqUpdate.push(false)
      }
    });
    
     
    }

  closeModal(){
    this.showModal = false;
  }

    viewReqUpdates(index:number){




      if(this.visibleReqUpdate[index]!=true){
      //clear the updates array first
      this.selectedReqUpdates.length = 0;
  
      //set updates array to updates of item selected
  
      for(var i  = 0;i<this.doneeUpdates[index].reqUpdates.length;i++){
        //console.log(this.donorUpdates[index].itemUpdates[i]["updateType"])
        const updateType = this.doneeUpdates[index].reqUpdates[i]["updateType"]
        const itemId = this.doneeUpdates[index].reqUpdates[i]["itemId"]
        const reqId = this.doneeUpdates[index].reqUpdates[i]["reqId"]
        const ngoId = this.doneeUpdates[index].reqUpdates[i]["ngoId"]
        const donorId = this.doneeUpdates[index].reqUpdates[i]["donorId"]
        
  
        //perform checks for optional fields
        var msg = "";
        var msgFrom = "";
        var ngoName = "";
        var itemQuality = ""
        var itemQuantity = "";
        var itemDetails = ""
        var itemImageLink = ""        
        var updateDate=""
        var pincode = ""
        if(this.doneeUpdates[index].reqUpdates[i]["message"])
          msg = this.doneeUpdates[index].reqUpdates[i]["message"];
        if(this.doneeUpdates[index].reqUpdates[i]["messageFrom"])
          msgFrom = this.doneeUpdates[index].reqUpdates[i]["messageFrom"];
        if(this.doneeUpdates[index].reqUpdates[i]["ngoName"])
          ngoName = this.doneeUpdates[index].reqUpdates[i]["ngoName"];
        if(this.doneeUpdates[index].reqUpdates[i]["itemQuantity"])
          itemQuantity = this.doneeUpdates[index].reqUpdates[i]["itemQuantity"];
        if(this.doneeUpdates[index].reqUpdates[i]["itemDetails"])
          itemDetails = this.doneeUpdates[index].reqUpdates[i]["itemDetails"];
        if( this.doneeUpdates[index].reqUpdates[i]["date"]) 
          updateDate = this.doneeUpdates[index].reqUpdates[i]["date"]
        if( this.doneeUpdates[index].reqUpdates[i]["itemImageLink"]) 
          itemImageLink = this.doneeUpdates[index].reqUpdates[i]["itemImageLink"]
         if( this.doneeUpdates[index].reqUpdates[i]["itemQuality"]) 
          itemQuality = this.doneeUpdates[index].reqUpdates[i]["itemQuality"]
          if( this.doneeUpdates[index].reqUpdates[i]["pincode"]) 
          pincode = this.doneeUpdates[index].reqUpdates[i]["pincode"]

        this.selectedReqUpdates.push(new RequirementUpdate(updateType,itemId,reqId,ngoId,donorId,pincode,ngoName,itemQuantity,itemQuality,itemImageLink,itemDetails,msgFrom,msg,updateDate));
      
      }
      //set visible flag for this itemUpdates to true and all others to false
      for(var i =0;i<this.doneeUpdates.length;i++){
        this.visibleReqUpdate[i]=false;
      }
      this.visibleReqUpdate[index]=true;
    }
    else{
      this.visibleReqUpdate[index]=!this.visibleReqUpdate[index];
    }
  }
  
    viewItemImage(reqIdx:number,updateIdx:number){
      window.open(this.baseUrlForImage + this.doneeUpdates[reqIdx].reqUpdates[updateIdx]["itemImageLink"])
    }
    
  
    sendMessage(){
    
      this.showModal = false;
      //get text from input field for message and send post req to server with reqId,donorId,itemId,ngoId

      //this.doneeService.sendMessageToDonor(this.doneeUpdates[this.reqIdx].reqUpdates[this.updateIdx]["reqId"],
      //this.doneeUpdates[this.reqIdx].reqUpdates[this.updateIdx]["itemId"],
      //this.doneeUpdates[this.reqIdx].reqUpdates[this.updateIdx]["donorId"],
      //this.doneeUpdates[this.reqIdx].reqUpdates[this.updateIdx]["reqIdngoId"],
      //this.messageBody).subscribe((data)=>{
      //  console.log(data)
      //})
      this.messageBody="";
    }

    setMsgIndex(reqIdx:number,updateIdx:number){
      this.reqIdx = reqIdx;
      this.updateIdx = updateIdx;
      this.showModal = true;

      console.log(this.reqIdx,this.updateIdx);
    }

    markReceived(reqIdx:number,updateIdx:number){
      this.doneeService.markReceived(this.doneeUpdates[this.reqIdx].reqUpdates[updateIdx]["reqId"],
      this.doneeUpdates[reqIdx].reqUpdates[updateIdx]["itemId"],
      this.doneeUpdates[reqIdx].reqUpdates[updateIdx]["donorId"],
      this.doneeUpdates[reqIdx].reqUpdates[updateIdx]["ngoId"]).subscribe((data)=>{
       console.log(data)
      })
    }

    deleteReq(reqIndex:number){

        this.doneeService.deleteRequirement(this.doneeUpdates[reqIndex].reqId,
          this.authService.getUserId()).subscribe((data)=>{
         console.log(data)
        });
  
    }

    acceptOrReject(reqIndex:number,updateIdx:number,actionTaken:string){
      this.doneeService.acceptOrReject(
        this.doneeUpdates[this.reqIdx].reqUpdates[this.updateIdx]["reqId"],
      this.doneeUpdates[this.reqIdx].reqUpdates[this.updateIdx]["itemId"],
      this.doneeUpdates[this.reqIdx].reqUpdates[this.updateIdx]["donorId"],
      this.doneeUpdates[this.reqIdx].reqUpdates[this.updateIdx]["ngoId"],
      actionTaken).subscribe((data)=>{
       console.log(data)
      });
    }
  
}
