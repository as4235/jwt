module.exports = function(req, res, next) {
    const { email, name, password } = req.body;
  
    function validEmail(userEmail) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }
  
    if (req.path === "/register") {         // every(Boolean) returns [1, 2, 3] if value exists in it
      if (![email, name, password].every(Boolean)) {  // if every variable inside this array is empty 
        return res.status(401).json("Missing Credentials");
      } else if (!validEmail(email)) {      // if not a valid email
        return res.status(401).json("Invalid Email");
      }
    } else if (req.path === "/login") {
      if (![email, password].every(Boolean)) {        // if every variable inside this array is empty
        return res.status(401).json("Missing Credentials");
      } else if (!validEmail(email)) {      // if not a valid email
        return res.status(401).json("Invalid Email");       
      }
    }
  
    next();
  };