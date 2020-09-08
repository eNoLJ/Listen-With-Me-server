const liked = require("../../models").likedList;
const playlist = require("../../models").PlayList;
const jwt = require("jsonwebtoken");
module.exports = {
  get: (req, res) => {
    let token = req.cookies.authorization;
    let count = 0;
    jwt.verify(token, process.env.JWT_secret, (err, decoded) => {
      playlist.findAll({ where: { owner_id: decoded.userid } }).then((list) => {
        if (list) {
          for (let i in list) {
            liked
              .count({ where: { likedList_id: list[i]["id"] } })
              .then((likes) => {
                count = count + likes;
              })
              .catch(() =>
                res
                  .status(500)
                  .send({ message: "getAllLikeAmount fail, server error" })
              );
          }
          res.status(200).send({ likeAmount: count });
        } else {
          res
            .status(400)
            .send({ message: "getAllLikeAmount fail, bad request" });
        }
      });
    });
  },
};
