const express  = require('express');
const router   = express.Router();
const User = require('../models/User');



router.patch('/:keyword/:type/add', async(req, res, next)=>{ // 키워드 추가
    next('route');
})

//db관련함수는 async/await로
router.route('/')
.get(async(req,res,next)=>{//특정 user정보조회
    try{
        const user=await User.findOne({_id:req.session.passport.user},{_id:0});
        res.send(user);
    }catch(err){
        console.error(err);
        next(err);
    }
})
.delete(async(req,res,next)=>{//user 삭제
    try{
        const result=await User.remove({_id:req.session.passport.user});
    }catch(err){
        console.error(err);
        next(err);
    }
    
})
.patch(async(req,res,next)=>{//user 정보 수정
    try{
        const result=await User.updateOne({_id:req.session.passport.user},{});//{}수정하고싶은거 정하고 구현, 그냥 객체 자체를 넣을까
        res.json(result);
    }catch(err){
        console.error(err);
        next(err);
    }
})


router.patch('/:keyword/delete',async(req,res,next)=>{//키워드 삭제
    try{
        const result=await User.updateOne({_id:req.session.passport.user},{$pull: { keyword : req.params.keyword}});
        res.json(result);
    }catch(err){
        console.error(err);
        next(err);
    }

})

router.patch('/:keyword/add',async(req,res,next)=>{//키워드 추가
    try{
        const result=await User.updateOne({_id:req.session.passport.user}, {$addToSet: {keyword: req.params.keyword }} );
        res.json(result);//matchcount 가 1이고 modified count 0 이면 중복
    }catch(err){
        console.error(err);
        next(err);
    }
})

/*
router.get('/keyword',async(req,res,next)=>{//keyword 조회
    try{
        const user=User.find({googleId:req.params.id},{_id:0,keyword:1});
        console.log(user);
        res.json(user);
    }catch(err){
        console.error(err);
        next(err);
    }
})
*/


module.exports = router;