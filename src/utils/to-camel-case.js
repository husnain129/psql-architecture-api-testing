module.exports = (rows) => {
  return rows.map((row) => {
    const replace = {};
    for (let key in row) {
      const camelCase = key.replace(/([-_][a-z])/gi, ($1) => {
        return $1.toUpperCase().replace("_", "");
      });
      replace[camelCase] = row[key];
    }
    return replace;
  });
};
