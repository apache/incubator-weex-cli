function AnchorTips(target,anchor,tips,container){
    this.container=container||document.body

    this.arrow=document.createElement('div')
    this.tipsCtn=document.createElement('div')
    this.target=target
    //new AnchorTips(document.querySelectorAll('.line.short>span:nth-child(1)')[0],AnchorTips.LEFT,'AAAAAAAAAAAAAAA')
    this.arrow.className=AnchorTips.classNameMap[anchor]
    this.tipsCtn.className='widget-anchor-tips'
    this.tipsCtn.innerHTML=tips
    this.anchor=anchor
    this.resolvePosition()
    this.container.appendChild(this.arrow)
    this.container.appendChild(this.tipsCtn)
    AnchorTips._instanceList.push(this)
}
AnchorTips.prototype.resolvePosition=function(){
    var rect=this.target.getBoundingClientRect()
    var transition=(0.2+Math.random()*0.4).toFixed(2)
    switch(this.anchor){
        case AnchorTips.LEFT:

            this. arrow.style.left=(rect.left-40)+'px'
            this.arrow.style.top=(rect.top)+'px'
            this.tipsCtn.style.cssText=`width: ${rect.left-25}px;left: 0;top: ${rect.top+40}px;text-align: right;transform:translate(-${rect.left}px,0);transition:${transition}s;`
            break
        case AnchorTips.LEFT_BOTTOM:
            this.arrow.style.left=(rect.left)+'px'
            this.arrow.style.top=(rect.top+20)+'px'
            this.tipsCtn.style.cssText=`width: ${rect.left-5}px;left: 0;top: ${rect.top+46}px;text-align: right;transform:translate(-${rect.left}px,0);transition:${transition}s;`
            break
        case AnchorTips.RIGHT:
            this.arrow.style.left=(rect.right-10)+'px'
            this.arrow.style.top=(rect.top-18)+'px'
            this.tipsCtn.style.cssText=`left: ${rect.right+30}px;right: 0;top: ${rect.top}px;text-align: left;transform:translate(${window.screen.availWidth-rect.right}px,0);transition:${transition}s;`

            break
        case AnchorTips.RIGHT_BOTTOM:
            this.arrow.style.left=(rect.left+30)+'px'
            this.arrow.style.top=(rect.bottom)+'px'
            this.tipsCtn.style.cssText=`left: ${rect.left+80}px;right: 0;top: ${rect.bottom+20}px;text-align: left;transform:translate(${window.screen.availWidth-rect.left}px,0);transition:${transition}s;`
            break
    }
}
AnchorTips.LEFT=1
AnchorTips.LEFT_BOTTOM=2
AnchorTips.RIGHT=3
AnchorTips.RIGHT_BOTTOM=4
AnchorTips.classNameMap={}
AnchorTips.classNameMap[AnchorTips.LEFT]='widget-anchor widget-anchor-left'
AnchorTips.classNameMap[AnchorTips.LEFT_BOTTOM]='widget-anchor widget-anchor-left-bottom'
AnchorTips.classNameMap[AnchorTips.RIGHT]='widget-anchor widget-anchor-right'
AnchorTips.classNameMap[AnchorTips.RIGHT_BOTTOM]='widget-anchor widget-anchor-right-bottom'
AnchorTips._instanceList=[]
window.onresize=function(){
    AnchorTips._instanceList.forEach(function(instance){
        instance.resolvePosition()
    })
}