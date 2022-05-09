import { atom, selector } from "recoil";

export const alertState = atom({
    key: "alertState",
    default: {
      content: "",
      type: "none",
    },
  });

export const currentContext = atom({
    key: "currentContext",
    default: "home",
})
  
export const sessionState = atom({
    key: "sessionState",
    default: {
      startDate: null, //project created date
      lastDate: null, //last edit date
      currentState: "Manager", //Change to creator when creating new scene
      scenes: "", //name of file with scene
    },
  });