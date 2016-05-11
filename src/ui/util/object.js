export function parse(obj) {
  var parsed = [];
  for(var key in obj) {
    var type = obj[key] === null ? 'null' : can.type(obj[key]);
    var current = {
      key: key,
      type: type,
      editable: type === 'number' || type === 'string' || type === 'boolean',
      hasChildren: typeof obj[key] === "object" && obj[key] !== null && Object.keys(obj[key]).length > 0,
      val: (type === 'object' || type === 'array') ? parse(obj[key]) : obj[key]
    }
    if(type === 'array') {
      current.len = obj[key].length;
    }
    if(type === 'function') {
      current.val = 'function ()';
    }
    parsed.push(current);
    parsed.parsed = true;
  }
  return parsed;
};

export function compose(obj, type) {
  var unparsed = {};

  if(type === 'array') {
    unparsed = [];
  }

  obj.forEach(function(val, key) {
    if(val.type === 'number' || val.type === 'string' || val.type === 'boolean' || val.type === 'function' || val.type === 'null') {
      unparsed[val.key] = val.val;
    } else {
      unparsed[val.key] = compose(val.val, val.type);
    }
  });
  return unparsed;
};

export function omit (item, keys) {
  var type = typeof item;
  if((type !== 'object' && type !== 'array') || keys.length === 0) {
    return item;
  }

  if(type === 'array') {
    return item.map(function(arrayItem) {
      return omit(arrayItem, keys);
    });
  } else {
    var res = {}
    for(var key in item) {
      if(keys.indexOf(key) === -1) {
        res[key] = omit(item[key], keys);
      }
    }
    return res;
  }
}
