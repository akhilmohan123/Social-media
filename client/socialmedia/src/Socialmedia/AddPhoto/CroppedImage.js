export default function getCroppedImage(imagSrc,pixelcrop,rotation){
    const image=new Image();
    image.src=imagSrc;
    return new Promise((resolve,reject)=>{
        image.onload=()=>{
            const canvas=document.createElement('canvas');
            const ctx=canvas.getContext("2d");
            canvas.width=pixelcrop.width;
            canvas.height=pixelcrop.height;
            ctx.drawImage(
                image,
                pixelcrop.x,
                pixelcrop.y,
                pixelcrop.width,
                pixelcrop.height,
                0,
                0,
                pixelcrop.width,
                pixelcrop.height
            )
            canvas.toBlob((blob)=>{
                if(!blob){
                    reject(new Error('Canvas is empty'))
                    return
                }
                const fileurl=URL.createObjectURL(blob)
                resolve(fileurl)
            },'image/jpeg')
        }
        image.onerror=()=>{
            reject(new Error('Failed to load image'))
        }
    })
}