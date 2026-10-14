const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const shortToLong = new Map();
const longToShort = new Map();

let counter = 0;

const BASEUrl = 'http://short.link/';