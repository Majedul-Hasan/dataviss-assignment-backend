
export const  adminMiddleware = (req, res, next)=>{
    console.log(req.auth);
    const {_id: adminUserId} = req.auth ;
    User.findById({_id: adminUserId}).exec((err, user)=>{
        if(err || !user) {
            return res.status(400).json({
                error: "User not found"
            })
        }
        if(!user.isAdmin){
            return res.status(400).json({
                error: "Admin resorce acces denied"
            })
        }
    req.profile = user
    next()
    })
}
