document.addEventListener('DOMContentLoaded', function(){
    const slide = document.querySelector('.carrossel-slide');
    const images = document.querySelectorAll('.carrossel-slide img');

    let currentIndex = 0;
    const totalImages = images.length;

    if(totalImages === 0){
        console.error('Nenhuma imagem encontrada.');
        return; //Impede o código de continuar se não houver imagens
    }

    const firstImageClone = images[0].cloneNode(true);
    slide.appendChild(firstImageClone);
    const secondImageClone = images[1].cloneNode(true);
    slide.appendChild(secondImageClone);
    const thirdImageClone = images[2].cloneNode(true);
    slide.appendChild(thirdImageClone);

    const imageWidth = images[0].clientWidth;

    function moveCarrosel1(){
        currentIndex++;
        
        // Se for a última imagem (clone), volta sem a animação para o início
        if (currentIndex >= totalImages){
            currentIndex = 0; //Volta para o início se for a última imagem
            slide.style.transform = `translateX(0px)`;// Mostra a primeira imagem
        }else{
            slide.style.transition = "transform 0.5 ease-in-out";
            slide.style.transform = `translateX(-${currentIndex * imageWidth}px)`;
        }
    }

    slide.style.width = `${imageWidth * (totalImages)}px`;

    //Muda as imagens automaticamente a cada 3 segundos
    setInterval(moveCarrosel1, 3000);
});