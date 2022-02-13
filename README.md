# Testador-Com-Threads-Node
### Para que serve esse código em node:
Resumidamente, para acelecar a velocidade dos testadores, usando **threads**. 
Se você ainda não ouviu falar sobre, os threads definem como um processador 
funciona, recebendo e executando instruções. Isso acontece muito 
rapidamente e passa a sensação de que as ações são simultâneas. 
Portanto, uma CPU com um thread tem apenas uma linha de trabalho – e realiza
uma ação por vez.

### Como usar:
1. Crie uma pasta com o nome **Aprovadas**, ela é onde o resultado das lives serão salvos.
2. Crie uma pasta com o nome **Reprovadas**, nesta sará salvo todos os resultados die.
3. Dentro no arquivo '''index.js''' tem uma linha com o comando abaixo:</br>
'''url: https://localhost/dashboard/web/2022/clientes/vr-beneficio/api.php?lista=${email}|${senha}''' </br>
você vai precisar trocar o nome do local onde se encontra a sua api.
