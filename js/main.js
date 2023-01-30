let eventBus = new Vue()

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
        <div class="product-image">
            <img :src="image" :alt="altText">
        </div>
        
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p v-if="inStock">
                In Stock
                <span v-if="onSale">{{ sale }}</span>
            </p>
            <p
                    v-else
                    :class="{ lineThrough: !inStock }"
            >
                Out of Stock
            </p>

            <div
                    class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{ backgroundColor: variant.variantColor }"
                    @mouseover="updateProduct(index)"
            >
            </div>

            <button
                @click="addToCart"
                :disabled="!inStock"
                :class="{ disabledButton: !inStock }"
            >
                Add to cart
            </button>
            <button
                @click="deleteFromCart"
                :disabled="!inStock"
                :class="{ disabledButton: !inStock }"
            >
                Delete from cart
            </button>
        </div>
        
        <product-tabs 
            :reviews="reviews" 
            :details="details"
        ></product-tabs>

    </div>
    `,
    data() {
        return {
            product: "Socks",
            brand: "Vue Mastery",
            selectedVariant: 0,
            altText: "A pair of socks",
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: './assets/vmSocks-green-onWhite.jpg',
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: './assets/vmSocks-blue-onWhite.jpg',
                    variantQuantity: 0
                }
            ],
            reviews: []
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', 
            this.variants[this.selectedVariant].variantId);
        },
        deleteFromCart() {
            this.$emit('delete-from-cart', 
            this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
     
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        onSale() {
            if (this.variants[this.selectedVariant].variantQuantity > 0 && this.variants[this.selectedVariant].variantQuantity <= 10) {
                return true
            } else {
                return false
            }
        },
        sale() {
            return this.brand + ' ' + this.product + " on sale"
        },
        shipping() {
            if (this.premium) {
                return eventBus.$emit('Free', productTabs)
            } else {
                return eventBus.$emit(2.99, productTabs)
            }
        },
        details() {
            return eventBus.$emit('details', productTabs)
        }
    }
})

Vue.component('product-details', {
    props:{
        details: {
            type: Array,
        }
    },
    template: `
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
    `,
})

Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
            <p v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="error in errors">{{ error }}</li>
                </ul>
            </p>

            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name" placeholder="name">
            </p>
        
            <p>
                <label for="review">Review:</label>
                <textarea id="review" v-model="review"></textarea>
            </p>
        
            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>

            <p>
                <p>Would you recommend this product?</p>
                <p>
                    <input type="radio" id="yes" value="yes" v-model="recomend" />
                    <label for="yes">Yes</label>
                    
                    <input type="radio" id="no" value="no" v-model="recomend" />
                    <label for="no">No</label>
                    <span>{{ recomend }}</span>
                </p>
            </p>
        
            <p>
                <input type="submit" value="Submit"> 
            </p>
    
        </form>
   
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recomend: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if(this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recomend: this.recomend
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recomend = null
            } else {
                this.errors.splice(0)
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
            }
         }         
    }
})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        }
     },     
    template: `
        <div>   
            <ul>
                <span class="tab"
                    :class="{ activeTab: selectedTab === tab }"
                    v-for="(tab, index) in tabs"
                    @click="selectedTab = tab"
                >{{ tab }}</span>
            </ul>
            <div v-show="selectedTab === 'Reviews'">
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>{{ review.name }}</p>
                        <p>Rating: {{ review.rating }}</p>
                        <p>{{ review.review }}</p>
                        <p v-if="review.recomend == 'yes'">
                            recomend 
                        </p>
                        <p v-else>
                            didn't recomend 
                        </p>
                    </li>
                </ul>
            </div>

            <div v-show="selectedTab === 'Make a Review'">
                <product-review></product-review>
            </div>

            

            <div v-show="selectedTab === 'Details'">
                <product-details :details="details"></product-details>
            </div>

        </div>
  `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Details'],
            selectedTab: 'Reviews',
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        }),
        eventBus.$emit('')
    },
 })
 
{/* <div v-show="selectedTab === 'Shipping'">
    <p>Shipping: {{ shipping }}</p>
</div> */}


let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        deleteCart() {
            this.cart.pop();
        }
        //не понимаю как удалить элемент по значению
    }   
})