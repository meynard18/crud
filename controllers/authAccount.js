const mysql2 = require('mysql2');
const bcrypt = require('bcrypt');

const db = mysql2.createConnection({
   host: process.env.DATABASE_HOST,
   port: process.env.DATABASE_PORT,
   user: process.env.DATABASE_USER,
   password: process.env.DATABASE_PASSWORD,
   database: process.env.DATABASE_NAME,
});

exports.register = (req, res) => {
   // Destructuring
   const { first_name, last_name, email, password, confirm_password } =
      req.body;

   //Validating if there is an existing records
   db.query(
      `SELECT email FROM admin WHERE email = ?`,
      [email],
      //// needed to use async to run parallel and encrypt password
      async (err, result) => {
         if (err) {
            console.log(err);
         }
         if (result.length > 0) {
            return res.render('registration', {
               message: 'Email entered is already in used!',
            });
         } else if (password != confirm_password) {
            return res.render('registration', {
               message: 'Password does not match!',
            });
         }
         /// async = == > await for promise //
         const hashedPassword = await bcrypt.hash(password, 8);

         db.query(
            `INSERT INTO admin SET ?`,
            {
               first_name: first_name,
               last_name: last_name,
               email: email,
               password: hashedPassword,
            },
            (err, result) => {
               if (err) {
                  console.log(err);
               } else {
                  return res.render('registration', {
                     message: 'User Registered!',
                  });
               }
            }
         );
      }
   );
};

exports.login = async (req, res) => {
   try {
      const { email, password } = req.body;
      if (!email || !password) {
         return res
            .status(400)
            .render('index', { message: 'Provide email and password' });
      }

      db.query(
         `SELECT * FROM admin WHERE email = ?`,
         [email],
         async (err, result) => {
            console.log(result);

            if (
               !result.length ||
               !(await bcrypt.compare(password, result[0].password))
            ) {
               console.log(result.length);
               return res.status(401).render('index', {
                  message: 'Email or password is incorrect!',
               });
            } else {
               db.query(`SELECT * FROM product`, (error, result) => {
                  res.render('list', { user: result, title: 'List of Songs' });
                  console.log(error, result);
               });
            }
         }
      );
   } catch (error) {
      console.log(error);
   }
};

exports.insert_song = (req, res) => {
   const { title, artist, category } = req.body;

   db.query(
      `INSERT INTO product (title, artist, category) VALUE (?,?,?)`,
      [title, artist, category],
      (err, result) => {
         if (err) console.log(err.message);
         db.query(`SELECT * FROM product`, (error, result) => {
            res.render('list', {
               user: result,
               message: `New Song Added, Title: ${title}`,
            });
            console.log(error, result);
         });
         // res.render('list', { user: result, message: `new song ${title}` });
      }
   );
};

exports.update_form = (req, res) => {
   const songId = req.params.id;
   db.query(`SELECT * FROM product WHERE id = ?`, [songId], (err, result) => {
      console.log(result);
      res.render('updateform', {
         title: `Edit Song`,
         user: result[0],
      });
   });
};

exports.update_song = (req, res) => {
   // const { id, title, artist, category } = req.body;
   const { id, title, artist, category } = req.body;
   db.query(
      `UPDATE product SET title = ?, artist = ?, category = ? WHERE id = ?`,

      [title, artist, category, id],
      (err) => {
         if (err) console.log(err);
         db.query(`SELECT * FROM product`, (err, result) => {
            console.log(err);
            res.render(`list`, {
               user: result,
               title: `List of Songs`,
               message2: `Song Id: ${id}, Song Title: ${title}, Artist: ${artist}, Category: ${category} has been updated!`,
            });
         });
      }
   );
};

exports.delete = (req, res) => {
   const songId = req.params.id;
   db.query(`DELETE FROM product WHERE id = ?`, [songId], (err) => {
      if (err) console.log(err);
      db.query(`SELECT * FROM product`, (err, result) => {
         res.render('list', {
            user: result,
            title: 'List of Songs',
            message3: `Song Id: ${songId} has been deleted`,
         });
      });
   });
};
