"use strict"

const DEBUG = true;
let KONAMI = false;
let HELL = false;
const GAME = {};

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
  BOTeasy: 3,
  BOTmedium: 4,
  BOThard: 5
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
    if(object===null) throw Error("null");
    if(object===undefined) throw Error("undefined");
  }
  static list(object, list)
  {
    let str;
    let comp;

    this.def(list);
    str = Object.prototype.toString.call(list);
    comp = Object.prototype.toString.call({});
    if(!(str===comp)) throw Error("wrong type"
        +"\n"
        +"(received " + str + ")"
        +"\n"
        +"(expected " + comp + ")");
    if(Object.keys(list).length===0) throw Error("empty set");

    this.def(object);
    str = Object.prototype.toString.call(object);
    comp = Object.prototype.toString.call("");
    if(str!=comp) throw Error("wrong type"
        +"\n"
        +"(received " + str + ")"
        +"\n"
        +"(expected " + comp + ")");
    if(!list[object]) throw Error("not in list"
        +"\n"
        +"(received \"" + object + "\")");
  }
  static proto(object, type)
  {
    this.list(type, TYPES);

    this.def(object);
    const str = Object.prototype.toString.call(object);
    const comp = "[object "+type+"]";
    if(str!=comp) throw Error("wrong type"
        +"\n"
        +"(received " + str + ")"
        +"\n"
        +"(expected " + "[object "+type+"]" + ")");
  }
  static instance(object, objectClass)
  {
    this.func(objectClass);
    this.object(object);
    if(!(object instanceof objectClass)) throw Error("wrong instance");
  }
  static sup(number, limit)
  {
    this.number(number);
    this.number(limit);
    if(number<limit) throw Error("too low"
        +"\n"
        +"(received "+number+"<"+limit+")");
  }
  static inf(number, limit)
  {
    this.number(number);
    this.number(limit);
    if(number>limit) throw Error("too low"
        +"\n"
        +"(received "+number+">"+limit+")");
  }
  static esup(number, limit)
  {
    this.number(number);
    this.number(limit);
    if(number<=limit) throw Error("too low"
        +"\n"
        +"(received "+number+"<="+limit+")");
  }
  static einf(number, limit)
  {
    this.number(number);
    this.number(limit);
    if(number>=limit) throw Error("too low"
        +"\n"
        +"(received "+number+">="+limit+")");
  }
  static eq(number, limit)
  {
    this.number(number);
    this.number(limit);
    if(number!=limit) throw Error("not equal"
        +"\n"
        +"(received "+number+"!="+limit+")");
  }
  static neq(number, limit)
  {
    this.number(number);
    this.number(limit);
    if(number===limit) throw Error("equal"
        +"\n"
        +"(received "+number+")");
  }





  static boolean(prout)
  {
    Check.def(prout);
    Check.proto(prout, "Boolean");
  }
  static number(prout)
  {
    Check.def(prout);
    Check.proto(prout, "Number");
  }
  static string(prout)
  {
    Check.def(prout);
    Check.proto(prout, "String");
  }
  static array(prout)
  {
    Check.def(prout);
    Check.proto(prout, "Array");
  }
  static object(prout)
  {
    Check.def(prout);
    Check.proto(prout, "Object");
  }
  static func(prout)
  {
    Check.def(prout);
    Check.proto(prout, "Function");
  }





  static row(prout)
  {
    Check.sup(prout, 0);
    Check.inf(prout, 9);
  }
  static column(prout)
  {
    Check.sup(prout, 0);
    Check.inf(prout, 9);
  }
  static name(prout)
  {
    Check.list(prout, SHIPS);
  }
  static rotation(prout)
  {
    Check.boolean(prout);
  }
  static up(prout)
  {
    Check.boolean(prout);
  }
  static grid(prout)
  {
    Check.instance(prout, Grid);
  }
  static block(prout)
  {
    Check.instance(prout, Block);
  }
  static length(prout)
  {
    Check.sup(prout, 2);
    Check.inf(prout, 5);
  }
  static blocks(prout, length)
  {
    Check.length(length);
    Check.array(prout);
    Check.eq(prout.length, length);
    prout.forEach(function(element, index, array)
        {
          Check.instance(element, Block);
        });
  }
  static state(prout)
  {
    Check.list(prout, STATES);
  }
  static special(prout)
  {
    Check.instance(prout, SpecialShot);
  }
  static bonus(prout)
  {
    Check.instance(prout, Bonus);
  }
  static ship(prout)
  {
    Check.instance(prout, Ship);
  }
  static ships(prout)
  {
    Check.instance(prout, Ships);
  }
  static login(prout)
  {
    Check.string(prout);
  }
  static owner(prout)
  {
    Check.list(prout, PLAYERS);
  }
}
