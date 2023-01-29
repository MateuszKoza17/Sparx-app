module.exports = {
  checkSlugString(value, incorrectString) {
    if (value === incorrectString) {
      throw new Error(`You can't use '${incorrectString}' keyword`);
    }
  },

  validateEmail(value) {
    let regex = new RegExp(
      "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
    );
    return regex.test(value);
  },
};
