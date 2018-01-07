import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'topMatch'
})
export class TopMatchPipe implements PipeTransform {

  transform(items: Array<any>, term: any): any {
    //check if search term is undefined
    if (term === undefined || term.length === 0) {
      return items.slice(0,4)
    } else {

      let fixedItem:Array<any>
      fixedItem = items.filter(function(item){
        return item.itemName.toLowerCase().includes(term.toLowerCase())
      })

      // console.log(fixedItem)

      let copyFixedItem:Array<any> = []

      for (let i = 0; i < fixedItem.length; i++) {
        let index = fixedItem[i].itemName.toLowerCase().indexOf(term.toLowerCase())

        copyFixedItem[i] = { ...fixedItem[i] }

        // console.log("length: "+copyFixedItem[i].itemName.length+", index: "+index+", term.len: "+term.length+
        //   ", " + copyFixedItem[i].itemName.substr(0,index) + 
        //   ", " + copyFixedItem[i].itemName.substr(index, term.length) + 
        //   ", " + copyFixedItem[i].itemName.substr(term.length+index, copyFixedItem[i].itemName.length-1))

        if (index != -1)
        copyFixedItem[i].itemName = copyFixedItem[i].itemName.substr(0,index) + 
          "<b class='addBlue'>" + copyFixedItem[i].itemName.substr(index, term.length) + 
          "</b>" + copyFixedItem[i].itemName.substr(term.length+index, copyFixedItem[i].itemName.length-1)

        if (i === fixedItem.length - 1) return copyFixedItem
      }

      //return copyFixedItem

    }

  }

}
