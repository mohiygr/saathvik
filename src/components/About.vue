<template lang="html">
  <div class="container mycontainer2">
    <section class="hero">
      <div class="hero-body">
        <div class="content">
          <figure class="image is-256x256 is-pulled-right">
            <img src="../assets/logo.png" alt="Saathvik Food Logo">
          </figure>
          <h1 class="title">About</h1>
          <h2 class="subtitle">With a decade of experience in organic and natural farming, the founders set out on a journey to solve easy adoption of organic foods. Towards this, Saathvik Food is a venture to make it very easy and delightful for everybody to consume healthy, traditional and forgotten dishes. We provide cooked traditional authentic south indian food items as Lunch and Dinner combo. We are also eager to hear your requirements, such as for party orders</h2>
          <h2 class="subtitle"><em>Natural & Organic</em>, of course!</h2>
          <h1 class="title">Motto</h1>
          <div class="level">
            <div class="level-item has-text-centered">
              <div class="box">
                <h1 class="title is-4">Natural</h1>
                <p class="heading is-4">Use only Natural and Organic ingredients</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div class="box">
                <h1 class="title is-4">Reliability</h1>
                <p class="heading is-4">Commit and Keep up committment</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div class="box">
                <h1 class="title is-4">Quality</h1>
                <p class="heading is-4">Ensure Goodness stays Good!</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div class="box">
                <h1 class="title is-4">Regenerative</h1>
                <p class="heading is-4">Regenerate nature and our traditions</p>
              </div>
            </div>
          </div>
          <div class="content">
            <h1 class="title">The Team</h1>
            <section>
              <div class="columns">
                <div class="column is-4">
                  <div class="card">
                    <div class="card-content">
                      <div class="media">
                        <div class="media-left">
                          <figure class="image is-96x96">
                            <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
                          </figure>
                        </div>
                        <div class="media-content has-centered-text">
                          <p class="title">Rukmani Mohan</p>
                          <p class="subtitle">Co-Founder</p>
                        </div>
                      </div>
                      <div class="content">
                        <em>Chudi</em>, a.k.a. Rukmani Mohan, has been a Woman entrepreneur since 1996. Her traditional indian womanly side shines through when she talks food, health and traditions. And no wonder, she contributes to recipes, design, tasting, and other master plans of Saathvik Food.
                        <br>
                      </div>
                    </div>
                  </div>
                </div> <!-- end of column -->
                <div class="column is-4">
                  <div class="card">
                    <div class="card-content">
                      <div class="media">
                        <div class="media-left">
                          <figure class="image is-96x96">
                            <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
                          </figure>
                        </div>
                        <div class="media-content has-centered-text">
                          <p class="title">Mohan Narayanan</p>
                          <p class="subtitle">Founder</p>
                        </div>
                      </div>
                      <div class="content">
                        With over 30 years of experience in running enterprises in the IT sector, Mohan Narayan also comes with a passion for organic agriculture. He oversees the entire operations of Saathvik Food..
                        <br>
                      </div>
                    </div>
                  </div>
                </div> <!-- end of column -->
                <div class="column is-4">
                  <div class="card">
                    <div class="card-content">
                      <div class="media">
                        <div class="media-left">
                          <figure class="image is-96x96">
                            <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
                          </figure>
                        </div>
                        <div class="media-content has-centered-text">
                          <p class="title">Sanjeev Mohan</p>
                          <p class="subtitle">CEO</p>
                        </div>
                      </div>
                      <div class="content">
                        Young and dashing Sanjeev Mohan has experience in sales and marketing and is passionate about running businesses. He ensures every Saathvik Food customer stays happy.
                        <br>
                      </div>
                    </div>
                  </div>
                </div> <!-- end of column -->
              </div> <!-- end of columns -->
              <h1 class="title">Approach</h1>
              <h2 class="subtitle">We wish to keep the customer delighted. This online website is one such means of keeping the customer talking and learning all about our traditions and these rare forgotten meals and their good effects for our health. So we would like you to reach out to us and let us know how we can delight you better.</h2>
              <h2 class="subtitle">We will be launching a digital applications platform using which <em>YOU</em> can play a part in helping us help you better. We welcome you to use the <router-link to="/contact">Contact Form</router-link> to get in touch with us. Or, if you want to stay tuned for our updates, just <router-link to="/auth">Signup</router-link> and we will send you e-mail updates.</h2>
            </section>
          </div>
        </div>
      </div>
  </section>

  </div>
</template>

<script>
export default {
  name: 'About',
  data () {
    return {
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Lobster');
@import url('https://fonts.googleapis.com/css?family=Yanone+Kaffeesatz');
.mycontainer2 {
background-color: white;
}
.mycontainer2 h1 {
font-family: 'Lobster', sans-serif;
padding: 10px;
}
.mycontainer2 p, h2 {
font-family: 'Yanone Kaffeesatz', sans-serif;
}
</style>
