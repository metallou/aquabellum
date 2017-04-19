"use strict"

const DEBUG = true;

const TYPES = {
  Boolean: 1,
  Number: 2,
  String: 3,
  Array: 4,
  Object: 5,
  Function: 6
};
const STATES = {
  unknown: 1,
  empty: 2,
  ship: 3,
  miss: 4,
  hit: 5,
  sunk: 6
};
const SHIPS = {
  destroyer: 1,
  cruiser: 2,
  submarine: 3,
  battleship: 4,
  carrier: 5
};
const PLAYERS = {
  self: 1,
  other: 2,
  botEasy: 3,
  botMedium: 4,
  botHard: 5
};
const DIFFICULTIES = {
  easy: 1,
  medium: 2,
  hard: 3
}

class Check
{
  static def(object)
  {
    try {
      if(object===null) throw "null";
      if(object===undefined) throw "undefined";
    } catch(error) {
      throw "Check.def - " + error;
    }
  }
  static list(object, list)
  {
    let str;
    let comp;
    try {
      try {
        this.def(object);
        str = Object.prototype.toString.call(object);
        comp = Object.prototype.toString.call("");
        if(!(str===comp)) throw "wrong type"
          +"\n"
            +"(received " + str + ")"
            +"\n"
            +"(expected " + comp + ")";
        if(!list[object]) throw "not in list"
          +"\n"
            +"(received \"" + object + "\")";
      } catch(error) {
        throw "object: " + error;
      }
      try {
        this.def(list);
        str = Object.prototype.toString.call(list);
        comp = Object.prototype.toString.call({});
        if(!(str===comp)) throw "wrong type"
          +"\n"
            +"(received " + str + ")"
            +"\n"
            +"(expected " + comp + ")";
        if(Object.keys(list).length===0) throw "empty set";
      } catch(error) {
        throw "list: " + error;
      }
    } catch(error) {
      throw "Check.list - " + error;
    }
  }
  static proto(object, type)
  {
    let str;
    let comp;
    try {
      try {
        this.def(type);
        str = Object.prototype.toString.call(type);
        comp = Object.prototype.toString.call("");
        if(!(str===comp)) throw "wrong type"
          +"\n"
            +"(received " + str + ")"
            +"\n"
            +"(expected " + comp + ")";
        Check.list(type, TYPES);
      } catch(error) {
        throw "type: " + error;
      }
      try {
        this.def(object);
        str = Object.prototype.toString.call(object);
        if(!(Object.prototype.toString.call(object)==="[object "+type+"]")) {
          throw "wrong type"
            +"\n"
            +"(received " + str + ")"
            +"\n"
            +"(expected " + "[object "+type+"]" + ")";
        }
      } catch(error) {
        throw "object: " + error;
      }
    } catch(error) {
      throw "Check.proto - " + error;
    }
  }
  static instance(object, objectClass)
  {
    try {
      try {
        this.def(object);
        this.proto(object, "Object");
      } catch(error) {
        throw "object: " + error;
      }
      try {
        this.def(objectClass);
        this.proto(objectClass, "Function");
      } catch(error) {
        throw "objectClass: " + error;
      }
      if(!(object instanceof objectClass)) throw "wrong instance";
    } catch(error) {
      throw "Check.instance - " + error;
    }
  }
  static sup(number, limit)
  {
    try {
      try {
        this.def(number);
        this.proto(number, "Number");
      } catch(error) {
        throw "number: " + error;
      }
      try {
        this.def(limit);
        this.proto(limit, "Number");
      } catch(error) {
        throw "limit: " + error;
      }
      if(number<limit) throw "too low"
        +"\n"
          +"(received "+number+"<"+limit+")"
    } catch(error) {
      throw "Check.sup - " + error;
    }
  }
  static inf(number, limit)
  {
    try {
      try {
        this.def(number);
        this.proto(number, "Number");
      } catch(error) {
        throw "number: " + error;
      }
      try {
        this.def(limit);
        this.proto(limit, "Number");
      } catch(error) {
        throw "limit: " + error;
      }
      if(number>limit) throw "too high"
        +"\n"
          +"(received "+number+">"+limit+")"
    } catch(error) {
      throw "Check.inf - " + error;
    }
  }
  static esup(number, limit)
  {
    try {
      try {
        this.def(number);
        this.proto(number, "Number");
      } catch(error) {
        throw "number: " + error;
      }
      try {
        this.def(limit);
        this.proto(limit, "Number");
      } catch(error) {
        throw "limit: " + error;
      }
      if(number<=limit) throw "too low"
        +"\n"
          +"(received "+number+"<="+limit+")"
    } catch(error) {
      throw "Check.esup - " + error;
    }
  }
  static einf(number, limit)
  {
    try {
      try {
        this.def(number);
        this.proto(number, "Number");
      } catch(error) {
        throw "number: " + error;
      }
      try {
        this.def(limit);
        this.proto(limit, "Number");
      } catch(error) {
        throw "limit: " + error;
      }
      if(number>=limit) throw "too high"
        +"\n"
          +"(received "+number+">="+limit+")"
    } catch(error) {
      throw "Check.einf - " + error;
    }
  }
  static eq(number, limit)
  {
    try {
      try {
        this.def(number);
        this.proto(number, "Number");
      } catch(error) {
        throw "number: " + error;
      }
      try {
        this.def(limit);
        this.proto(limit, "Number");
      } catch(error) {
        throw "limit: " + error;
      }
      if(!(number===limit)) throw "not equal"
        +"\n"
          +"(received "+number+"!="+limit+")"
    } catch(error) {
      throw "Check.eq - " + error;
    }
  }
  static neq(number, limit)
  {
    try {
      try {
        this.def(number);
        this.proto(number, "Number");
      } catch(error) {
        throw "number: " + error;
      }
      try {
        this.def(limit);
        this.proto(limit, "Number");
      } catch(error) {
        throw "limit: " + error;
      }
      if(number===limit) throw "equal"
        +"\n"
          +"(received "+number+"=="+limit+")"
    } catch(error) {
      throw "Check.neq - " + error;
    }
  }
}
