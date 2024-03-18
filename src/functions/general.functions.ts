export function convertToBoolean(input : string): boolean{
    try{
        return JSON.parse(input.toLowerCase());
    }
    catch(e){
        return false;
    }


}