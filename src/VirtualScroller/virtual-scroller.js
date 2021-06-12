const DEBUG = true
const log = DEBUG ? console.log : function () { }

function debounce(fn, delay) {
    let timeoutId
    return function (...args) {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }

        timeoutId = setTimeout(function () {
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
                    return 2 * window.innerHeight
                }
            },
            ...options
        },
        list: {
            size: 0,
            startAt: 0,
            rows: {},
            cache: {}
        },
        offset: {
            top: 0,
            bottom: 0
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
            } else {
                // remove last child which corresponds to the first item of the row that exceeded this.getVpHeight()
                this.container.removeChild(this.container.lastChild)
            }

            this.sentinels.top.element = this.container.querySelector(`*:first-child`)
            this.sentinels.bottom.element = this.container.querySelector(`*:nth-child(${this.list.size})`)

            this.sentinels.top.element.classList.add('sentinel')
            this.sentinels.bottom.element.classList.add('sentinel')

            this.defineRows()

            const bottomSentinelBoundingClientRect = this.sentinels.bottom.element.getBoundingClientRect()
            const minHeight = window.innerHeight +
                this.list.rows[this.list.startAt].height +
                bottomSentinelBoundingClientRect.height

            if (containerBoundingClientRect.height - bottomSentinelBoundingClientRect.height < minHeight) {
                this.addSlots(containerBoundingClientRect.height + bottomSentinelBoundingClientRect.height)
            }
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
                        this.list.rows[index] = { height: 0, items: [] }
                        index++
                    }
                }

                this.list.rows[index - 1].items.push(this.list.startAt + i)

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
                        // this.prepend(entry)
                    } else if (entry.target === this.sentinels.bottom.element && this.list.startAt < this.items.length) {
                        this.append(entry)
                    }
                })
            }

            const observer = new IntersectionObserver(callback, options)

            observer.observe(this.sentinels.top.element)
            observer.observe(this.sentinels.bottom.element)
        },

        append(entry) {
            log('append')
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

            const slots = Array.from(this.container.children)

            log(this.list.startAt, slots.length, this.items.length)

            if (this.list.startAt + slots.length >= this.items.length) {
                return
            }

            this.offset()
            this.container.style.transform = `translateY(${this.offset.top}px)`
            this.addSlots()

            log(this.list.startAt, slots.length, this.items.length)

            for (let i = 0; i < slots.length; i++) {
                const index = i + this.list.startAt

                if (index === this.items.length) {
                    break
                }

                this.container.children[i].innerHTML = ''
                this.renderItem({
                    index,
                    container: this.container.children[i]
                })
            }

            this.defineRows()
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

        offset() {
            let height = 0
            let index = 0

            for (const i of Object.keys(this.list.rows)) {
                const row = this.list.rows[i]
                height += row.height
                index += row.items.length

                if (height + row.height > window.pageYOffset) {
                    this.offset.top = height
                    this.list.startAt = index
                    break
                }
            }
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

    virtualScroller.addSlots()
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