const DEBUG = true
const log = DEBUG ? console.log : function() {}

function debounce(fn, delay) {
    let timeoutId
    return function(...args) {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }

        timeoutId = setTimeout(function() {
            fn(...args)
        }, delay)
    }
}

function createVirtualScroller({ container, items, renderSlot, renderItem, options = {} }) {
    return {
        container,
        items,
        renderSlot,
        renderItem,
        config: {
            ...{
                cacheSize: 200,
                getVpHeight() {
                    return 2 * window.innerHeight
                }
            },
            ...options
        },
        list: {
            init: false,
            size: 0,
            startAt: 0,
            rows: {},
            cache: {}
        },
        sentinels: {
            top: {
                element: undefined,
                previousY: 0,
                previousRatio: 0
            },
            bottom: {
                element: undefined,
                previousY: 0,
                previousRatio: 0
            }
        },
        isScrollingUp: undefined,
        
        initList() {
            this.addSlots()
        },

        updateList() {
            const containerHeight = this.container.getBoundingClientRect().height
            const vpHeight = this.config.getVpHeight()
            
            if (containerHeight === vpHeight) {
                return
            }

            if (containerHeight > vpHeight) {
                this.removeSlots()
            } else {
                this.addSlots()
            }
        },

        addSlots(height) {
            const vpHeight = height || this.config.getVpHeight()
            let containerBoundingClientRect

            for (let i = this.list.startAt; i < this.items.length; i++) {
                if (this.list.cache.length > this.list.cacheSize) {
                    this.cache = []
                }

                const index = i - this.list.startAt

                if (this.container.children[index]) {
                    continue
                }

                this.renderSlot({ index: i, container: this.container })
                this.renderItem({ index: i, container: this.container.lastChild })

                containerBoundingClientRect = this.container.getBoundingClientRect()
                
                if (containerBoundingClientRect.height > vpHeight) {
                    this.list.size = index
                    break
                }
            }

            // if all items do not fill the viewport height => this.listSize has a value of 0
            if (this.list.size === 0) {
                this.list.size = this.items.length
            } else  {
                // remove last child which corresponds to the first item of the row that exceeded this.getVpHeight()
                this.container.removeChild(this.container.lastChild)
            }

            this.sentinels.top.element = this.container.querySelector(`*:first-child`)
            this.sentinels.bottom.element = this.container.querySelector(`*:nth-child(${this.list.size})`)

            this.defineRows()

            // const bottomSentinelBoundingClientRect = this.sentinels.bottom.element.getBoundingClientRect()
            // const minHeight = window.innerHeight +
            //     this.list.rows[this.list.startAt].height +
            //     bottomSentinelBoundingClientRect.height

            // if (containerBoundingClientRect.height - bottomSentinelBoundingClientRect.height < minHeight) {
            //     this.addSlots(containerBoundingClientRect.height + bottomSentinelBoundingClientRect.height)
            // }
        },

        removeSlots() {
            const vpHeight = this.config.getVpHeight()
            const items = Array.from(this.container.children)

            for (let i = this.list.startAt + this.list.size; i > 0; i--) {
                const index = i - this.list.startAt
                const containerBoundingClientRect = this.container.getBoundingClientRect()

                if (items[index - 1]) {
                    this.container.removeChild(items[index - 1])
                }

                if (containerBoundingClientRect.height < vpHeight) {
                    this.list.size = index
                    break
                }
            }
        },

        defineRows() {
            if (this.list.rows.length >= this.list.startAt + this.list.size) {
                return
            }

            const containerBoundingClientRect = this.container.getBoundingClientRect()
            const slots = Array.from(this.container.children)
            let index = this.list.startAt
            
            for (let i = 0; i < slots.length; i++) {
                const slotBoundingClientRect = slots[i].getBoundingClientRect()
                
                if (containerBoundingClientRect.left === slotBoundingClientRect.left) {
                    if (index >= this.list.startAt) {
                        this.list.rows[index] = { height: 0, items: [] }
                        index++
                    }
                }

                this.list.rows[index - 1].items.push(this.list.startAt + i)

                if (slotBoundingClientRect.height > this.list.rows[index - 1].height) {
                    this.list.rows[index - 1].height = slotBoundingClientRect.height
                }
            }
        },

        observe() {
            const options = {}
        
            const callback = entries => {
                entries.forEach(entry => {
                    if (entry.target === this.sentinels.top.element) {
                        this.prepend(entry)
                    } else if (entry.target === this.sentinels.bottom.element) {
                        this.append(entry)
                    }
                })
            }
        
            const observer = new IntersectionObserver(callback, options)
        
            observer.observe(this.sentinels.top.element)
            observer.observe(this.sentinels.bottom.element)
        },
        
        append(entry) {
            const currentY = entry.boundingClientRect.top
            const currentRatio = entry.intersectionRatio
        
            this.isScrollingUp = !(entry.isIntersecting &&
                currentY < this.sentinels.bottom.previousY &&
                currentRatio > this.sentinels.bottom.previousRatio)
            
            this.sentinels.bottom.previousY = currentY
            this.sentinels.bottom.previousRatio = currentRatio
        
            if (this.isScrollingUp) {
                return
            }

            log('append...')
        
            this.list.startAt = this.getIndex()
            this.container.style.transform = `translateY(${window.pageYOffset}px)`

            const slots = Array.from(this.container.children)
            
            for (let i = 0; i < slots.length; i++) {
                const index = i + this.list.startAt

                this.container.children[i].innerHTML = ''
                this.renderItem({ index, container: this.container.children[i] })
            }
        },

        prepend(entry) {
            const currentY = entry.boundingClientRect.top
            const currentRatio = entry.intersectionRatio
        
            this.isScrollingUp = entry.isIntersecting &&
                currentY > this.sentinels.top.previousY &&
                currentRatio >= this.sentinels.top.previousRatio
        
            this.sentinels.top.previousY = currentY
            this.sentinels.top.previousRatio = currentRatio
        
            if (!this.isScrollingUp) {
                return
            }
        
            const index = this.getIndex()
        
            this.list.startAt = index
        
            log('prepend...')
        },
        
        getIndex() {            
            return this.list.startAt + 10
        }
    }
}

export function init({ container, items, renderSlot, renderItem, options }) {
    const virtualScroller = createVirtualScroller({
        container,
        items,
        renderSlot,
        renderItem,
        options
    })
    
    virtualScroller.initList()
    virtualScroller.observe()
    
    window.addEventListener(
        'resize',
        debounce(
            virtualScroller.updateList.bind(virtualScroller),
            50
        )
    )

    window.virtualScroller = virtualScroller
}