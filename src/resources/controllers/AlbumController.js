const AlbumService = require("../services/Album");
const fs = require('fs');
const root = process.env.ENVIRONMENT == 'dev' ? './src/public/uploads' : './haisanconamsaigon/src/public/uploads';

const AlbumController = {
    // GET /album/list
    getList: (req,res,next) => {
        AlbumService.list({},{})
            .then(albums => {
                let listAlbum = []
                albums.forEach(item => {
                    listAlbum.push({url: item.url});
                })
                res.json({listAlbum})
            })
            .catch(err => {
                res.json({listAlbum: {}})
            })
    },
    getAll: (req,res,next) => {
        const error = req.flash('error') || "";
        const success = req.flash('success') || "";
        AlbumService.list({},{})
        .then(albums => {
            let listAlbum = [];
            let index = 0;
            if (albums.length == 0) 
                return res.render('Pages/Album/albumList', {layout:"admin", empty: true});
            albums.forEach(item => {
                index++;
                listAlbum.push({id: item._id,url: item.url, name: item.name, createdAt: item.createdAt,index});
            })
            res.render('Pages/Album/albumList', {layout:"admin", success, error, data: listAlbum});
        })
        .catch(err => {
            res.render('Pages/Album/albumList', {layout:"admin", success, error, empty: true});
        })
    },
    // GET /album/add
    getAddAlbum: (req,res,next) => {
        const error = req.flash('error') || "";
        const success = req.flash('success') || "";
        res.render('Pages/Album/addAlbum', {layout: 'admin', success, error});
    },
    // POST /album/add
    postAddAlbum: async (req,res,next) => {
        const file = req.file;
        if (file) {
            const url = `/uploads/album/${req.body.name}/${file.filename}`;
            const album = {
                name: req.body.name,
                url
            }
            await AlbumService.create(album)
                .then(() => {
                    req.flash('success', 'Th??m ???nh v??o album th??nh c??ng');
                    return res.redirect('/album/add');
                })
                .catch(err => {
                    req.flash('error', 'Th??m ???nh v??o album th???t b???i ' + err);
                    return res.redirect('/album/add');
                })
        } else {
            req.flash('error', 'Vui l??ng ch???n ???nh');
            return res.redirect('/album/add');
        }
    },
    // GET /album/delete/:id
    deleteAlbum: async (req,res,next) => {
        await AlbumService.delete(req.params.id)
            .then(album => {
                fs.rm(`${root}/album/${album.name}`, { recursive: true }, err => {
                    if (!err) {
                        req.flash('success', 'X??a ???nh trong album th??nh c??ng');
                        return res.redirect('/album/all');
                    }
                })
                
            })
            .catch(err => {
                req.flash('error', 'X??a ???nh trong album th???t b???i ' + err);
                return res.redirect('/album/all');
            })
    }
};

module.exports = AlbumController;