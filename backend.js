const apiKey = "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";
const maxImages=4;
let selectedImageNum=null;
function randomNum(min, max){
    return Math.floor(Math.random() * (max-min+1)) + min;
}
function disableGenerateButton(){
    document.getElementById("generate").disabled=true;

}
function enableGenerateButton(){
    document.getElementById("generate").disabled=false;
}
function clearImageGrid(){
    const imageGrid = document.getElementById("image-grid");
    imageGrid.innerHTML= "";
}
async function generateIMG(input){
    disableGenerateButton();
    clearImageGrid();
    const loading = document.getElementById("loading");
    loading.style.display="block";
    
    const imgURLS=[];
    for(let i=0;i<maxImages;i++)
    {
        const randomNumber = randomNum(1,10000);
        const prompt = `Generate a highly realistic and attractive HD image with intricate details of ${input} ${randomNumber}`;
        const response = await fetch(
        "https://api-inference.huggingface.co/models/SG161222/Realistic_Vision_V1.4",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({ inputs: prompt}) 
        }
        );

        if(!response.ok)
        {
            alert("Failed to generate Image!");
        }
        const blob = await response.blob();
        const imgURL = URL.createObjectURL(blob);
        imgURLS.push(imgURL);

        const img = document.createElement("img");
        img.src = imgURL;
        img.alt = `art-${i+1}`;
        img.onclick = () => downloadImage(imgURL, i);
        document.getElementById("image-grid").appendChild(img);
    }
    loading.style.display="none";
    enableGenerateButton();
    selectedImageNum=null;
}
document.getElementById("generate").addEventListener('click',()=>{
    const input = document.getElementById("user-prompt").value;
    generateIMG(input);
});
function downloadImage(imgURL,imageNumber)
{
    const link = document.createElement("a");
    link.href=imgURL;
    link.download = `image-${imageNumber+1}.jpg`;
    link.click();
}

