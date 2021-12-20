var express = require('express');
var router = express.Router();
var User = require("../models/User")
var Question = require("../models/Question")
var Answer = require("../models/Answer")
var auth = require("../middlewares/auth");
var slug = require("slug");

router.post("/", auth.verifyToken, async (req, res, next) => {
    req.body.tagList = req.body.tagList.split(",").map((ele) => ele.trim());
    req.body.author = req.user.userId;
    try {
        req.body.slug = await slug(req.body.title);
        var question = await Question.create(req.body);
        res.json({ question });
    } catch (error) {
        next(error);
    }
});

router.get("/", async (req, res, next) => {
    try {
        let questions = await Question.find().populate("author").exec();
        return res.send({ questions });
    } catch (error) {
        next(error);
    }
});

router.put("/:questionId", async (req, res, next) => {
    var id = req.params.questionId
    try {
        let question = await Question.findByIdAndUpdate(id, req.body)
        return res.send({ question });
    } catch (error) {
        next(error);
    }
});

router.delete("/:questionId", async (req, res, next) => {
    var id = req.params.questionId
    try {
        let deletedQuestion = await Question.findByIdAndDelete(id)
        await Answer.findByIdAndDelete(deletedQuestion.answer);
        return res.send({ question });
    } catch (error) {
        next(error);
    }
});

router.post("/:questionId/answers", auth.verifyToken, async (req, res, next) => {
    req.body.author = req.user.userId;
    var id = req.params.questionId;
    req.body.question = id
    try {
        var answer = await Answer.create(req.body);
        var question = await Question.findByIdAndUpdate(id,{$push:{answer:answer.id}});
        res.json({ answer,question });
    } catch (error) {
        next(error);
    }
});

router.get("/:questionId/answers", auth.verifyToken, async (req, res, next) => {
    var questionId = req.params.questionId;
    try {
        var answers = await Answer.find({ question: questionId });
        res.json({ answers });
    } catch (error) {
        next(error);
    }
});

router.put("/answers/:answerId", async (req, res, next) => {
    var answerId = req.params.answerId
    try {
        let answer = await Answer.findByIdAndUpdate(answerId, req.body)
        return res.send({ answer });
    } catch (error) {
        next(error);
    }
});

router.delete("/answers/:answerId", async (req, res, next) => {
    var answerId = req.params.answerId
    try {
        let answer = await Answer.findByIdAndDelete(answerId)
        let question = await Question.findOneAndUpdate({answerId},{$pull:{answer:answerId}})
        return res.send({ answer,question });
    } catch (error) {
        next(error);
    }
});

router.get('/tags', async (req, res, next) => {
    try {
        let questions = await Question.find({});
        tags = questions.map(ele => ele.tagList).flat(Infinity);
        res.json({tags})
    } catch (error) {
    }
})

module.exports = router