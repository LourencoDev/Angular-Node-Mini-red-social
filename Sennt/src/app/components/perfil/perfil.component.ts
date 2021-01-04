import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { PublicacionService } from '../../services/publicacion.service';
import { Publicacion } from '../../models/publicacion';
import axios from 'axios';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  public user: any
  public mispublicaciones: any
  public llegamispublicaciones: any
  public img: any
  public sub_img = false
  public img_clou: any
  public img_url: any
  public addpublicacion = new Publicacion('', '', '', '', '', '')
  public valid = false
  public valid_publi: any
  public NoPubli = false
  public cloudinary_url = 'https://api.cloudinary.com/v1_1/sennt03/image/upload'

  /* EDIT Y DELETE */
  public publiId: any
  public editPublicacion: any = null


  constructor(
    private _userService: UserService,
    private _publiService: PublicacionService
  ) {}

  ngOnInit() {
    let id = localStorage.getItem('usl')
    this.getUser(id)
    this.getPersonalPublicaciones(id)
  }

  getUser(id){
    this._userService.getUser(id).subscribe(
      response => {
        this.user = response
      },
      err => {
        
      }
    )
  }

  getPersonalPublicaciones(id){
    this.mispublicaciones = []
      this._publiService.getPersonalPublicaciones(id).subscribe(
        response => {
          let invPublicaciones = response
          this.llegamispublicaciones = invPublicaciones
          this.llegamispublicaciones.reverse()
          this.mispublicaciones = this.llegamispublicaciones
          if(this.mispublicaciones.length == 0){
            this.NoPubli = true
          }else{
            this.NoPubli = false
          }
        },
        err => {
          console.log(err)
        }
      )
  }

   publicar(){
   
     if(this.addpublicacion.publicacion == '' && this.sub_img == false){
       this.valid = true
       this.valid_publi = 'LLene algun campo porfavor'
     }else{
       this.valid = true
       this.valid_publi = 'Publicando...'
       this.confirmPublicar()
     }
  }

  async confirmPublicar(){
    if(this.sub_img){
      const res = await axios.post(this.cloudinary_url, this.img, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
      console.log(res)
      this.img_url = res.data.secure_url
    
  }

  let id = localStorage.getItem('usl')
      this._userService.getUser(id).subscribe(
        response => {
          this.user = response
          if(this.sub_img){
            this.addpublicacion.imgPubli = this.img_url
          }
          this.addpublicacion.userId = this.user._id
          this.addpublicacion.user = this.user.name
          this.addpublicacion.img = this.user.image
          this._publiService.addPublicacion(this.addpublicacion).subscribe(
            response => {
              this.valid_publi = 'Publicacion subida correctamente'
              this.addpublicacion.publicacion = ''
              this.sub_img = false
              this.img_url = ''
              
              this.resetValid()
              this.getPersonalPublicaciones(id)
            },
            err => {
              console.log(err)
            }
          )
        },
        err => {
          console.log(err)
        }
      )

}

  resetValid(){
    setTimeout(() => {
      this.valid = false
    }, 3000);
  }

  imgPre(e){
    let img = e.target.files[0]
    let formData = new FormData()
    formData.append('file', img)
    formData.append('upload_preset', 'senntio')
    formData.append('cloud_name', 'sennt03')
    this.img = formData
    this.sub_img = true
  }

  getPubliId(id){
    this.publiId = id
  }

  borrar(){
    let id = localStorage.getItem('usl')
    this.valid = true
    this.valid_publi = 'Eliminando..'
    this._publiService.deletePublicacion(this.publiId).subscribe(
      response => {
        this.valid_publi = 'Eliminada correctamente'
        this.resetValid()
        setTimeout(() => {
          this.getPersonalPublicaciones(id)
        }, 4000)
      },
      err => {
        console.log(err)
      }
    )
  }

  getPubliEdit(id){
    this._publiService.getPublicacion(id).subscribe(
      response => {
        this.editPublicacion = response
      },
      err => {
        console.log(err)
      }
    )
  }

  editar(){
    let id = localStorage.getItem('usl')
    this.valid = true
    this.valid_publi = 'Editando publicacion...'
    this._publiService.editPublicacion(this.editPublicacion).subscribe(
      response => {
        this.valid_publi = 'Editada correctamente'
        this.resetValid()
        this.editPublicacion = null
        setTimeout(() => {
          this.getPersonalPublicaciones(id)
        }, 4000)
      },
      err => {
        console.log(err)
      }
    )
  }

  resetEdit(){
    this.editPublicacion = null
  }

  resetPubliId(){
    this.publiId = null
  }

}
