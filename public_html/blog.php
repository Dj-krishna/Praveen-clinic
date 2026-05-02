<!DOCTYPE html>
<html lang="en">
 
<head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dr Prveeen Reddy - Bone & Joint Surgeon </title>

     <meta name="keywords" content="" />
    <meta name="description" content="" />

     <!--=====FAB ICON=======-->
    <link rel="shortcut icon" href="/assets/img/logo/fav-logo1.png" type="image/x-icon">

    <!--===== CSS LINK =======-->
    <link rel="stylesheet" href="/assets/css/plugins/bootstrap.min.css">
    <link rel="stylesheet" href="/assets/css/plugins/aos.css">
    <link rel="stylesheet" href="/assets/css/plugins/fontawesome.css">
    <link rel="stylesheet" href="/assets/css/plugins/magnific-popup.css">
    <link rel="stylesheet" href="/assets/css/plugins/owlcarousel.min.css">
    <link rel="stylesheet" href="/assets/css/plugins/sidebar.css">
    <link rel="stylesheet" href="/assets/css/plugins/slick-slider.css">
    <link rel="stylesheet" href="/assets/css/plugins/nice-select.css">
    <link rel="stylesheet" href="/assets/css/plugins/swiper-bundle.css">
    <link rel="stylesheet" href="/assets/css/main.css">

    <!--=====  JS SCRIPT LINK =======-->
    <script src="/assets/js/plugins/jquery-3-7-1.min.js"></script>
</head>
<body class="homepage1-body">
  
 
<?php include('header.php'); ?>
<?php
$blogs = [];
$api_url = 'https://drpraveenreddyortho.com/api/blogs';
$ch = curl_init($api_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
$response = curl_exec($ch);
if($response !== false) {
    $data = json_decode($response, true);
    if(isset($data['success']) && $data['success'] && isset($data['data'])) {
        $blogs = $data['data'];
    }
}
curl_close($ch);
?>

<!--===== MOBILE HEADER STARTS =======-->
<!--===== HERO AREA STARTS =======-->
<div class="inner-header-section-area" style="background-image: url(assets/img/all-images/bg/innerpage-banner.png); background-position: center; background-repeat: no-repeat; background-size: cover;">
  <img src="assets/img/elements/logoicon.png" alt="" class="elements28">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-lg-12">
        <div class="hero-header">
          <h1 class="text-anime-style-1">Blogs</h1>
          <div class="space28"></div>
          <a href="index.html" class="bradecrumb">Home <i class="fa-solid fa-angle-right"></i> Blog Articles</a>
        </div>
      </div>
    </div>
  </div>
</div>
<!--===== HERO AREA ENDS =======-->

<!--===== BLOG AREA STARTS =======-->
<div class="vl-blog-4-area-inner sp2">
    <div class="container">
       <div class="row">

        <?php if(!empty($blogs)): ?>
           <?php foreach($blogs as $blog): ?>
           <?php 
             $dateStr = '';
             if (!empty($blog['dateOfPost'])) {
                 try {
                     $dateObj = new DateTime($blog['dateOfPost']);
                     $dateStr = $dateObj->format('d M Y');
                 } catch (Exception $e) {}
             }
             
             $defaultImage = 'assets/img/all-images/blog/blog-img4.png';
             $image = $defaultImage;
             $baseUrl = 'https://drpraveenreddyortho.com/api/';
             
             if (!empty($blog['postBanner'])) {
                 $image = strpos($blog['postBanner'], 'http') === 0 ? $blog['postBanner'] : $baseUrl . ltrim($blog['postBanner'], '/');
             }
             if (!empty($blog['postThumbnail'])) {
                 $image = strpos($blog['postThumbnail'], 'http') === 0 ? $blog['postThumbnail'] : $baseUrl . ltrim($blog['postThumbnail'], '/');
             }
             
             // Generate clean URL for blog post (e.g., /blog/slug)
             $slug = ltrim($blog['url'] ?? '', '/');
             $blogUrl = '/' . $slug;
           ?>

           <div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-duration="900">
             <div class="vl-blog-1-item" style="height: 100%; display: flex; flex-direction: column;">
                <div class="vl-blog-1-thumb image-anime">
                   <a href="<?php echo htmlspecialchars($blogUrl); ?>">
                      <img src="<?php echo htmlspecialchars($image); ?>" 
                           alt="<?php echo htmlspecialchars($blog['title'] ?? ''); ?>" 
                           style="width: 100%; height: 250px; object-fit: cover;"
                           onerror="this.onerror=null; this.src='data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 400 250'%3E%3Crect width='100%25' height='100%25' fill='%23f5f0eb'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='16' font-weight='500' fill='%23b8a99a' dominant-baseline='middle' text-anchor='middle'%3ENo Image Available%3C/text%3E%3C/svg%3E'">
                   </a>
                </div>
                <div class="vl-blog-1-content" style="flex: 1; display: flex; flex-direction: column;">
                 <div class="vl-blog-meta">
                    <ul>
                     <li>
                       <a href="#"><?php echo htmlspecialchars($dateStr); ?></a>
                   </li>
                    </ul>
                 </div>
                 <div class="space16"></div>
                 <h4 class="vl-blog-1-title"><a href="<?php echo htmlspecialchars($blogUrl); ?>"><?php echo htmlspecialchars($blog['title'] ?? ''); ?></a></h4>
                 <div class="space28" style="flex: 1;"></div>
                 <div class="vl-blog-1-icon">
                   <a href="<?php echo htmlspecialchars($blogUrl); ?>" class="learnmore">Read Article<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                       <path fill-rule="evenodd" clip-rule="evenodd" d="M7.99992 0.833496C4.04188 0.833496 0.833252 4.04212 0.833252 8.00016C0.833252 11.9582 4.04188 15.1668 7.99992 15.1668C11.958 15.1668 15.1666 11.9582 15.1666 8.00016C15.1666 4.04212 11.958 0.833496 7.99992 0.833496ZM7.33325 5.3335C7.06359 5.3335 6.82052 5.49592 6.71732 5.74504C6.61415 5.99416 6.67119 6.2809 6.86185 6.47157L7.72379 7.3335L5.52851 9.52876C5.26817 9.7891 5.26817 10.2112 5.52851 10.4716C5.78887 10.7319 6.21097 10.7319 6.47133 10.4716L8.66659 8.2763L9.52852 9.13823C9.71919 9.3289 10.0059 9.38596 10.2551 9.28276C10.5042 9.17956 10.6666 8.9365 10.6666 8.66683V6.00016C10.6666 5.63198 10.3681 5.3335 9.99992 5.3335H7.33325Z" fill="#666"/>
                     </svg></a>
                 </div>
               </div>
             </div>
           </div>
           
           <?php endforeach; ?>
        <?php else: ?>
            <div class="col-12 text-center">
                <p>No blogs available.</p>
            </div>
        <?php endif; ?>

       </div>
    </div>
  </div>
  <!--===== BLOG AREA ENDS =======-->

<?php include('getintouch.php'); ?>
<?php include('footer.php'); ?>


<!--===== JS SCRIPT LINK =======-->
<script src="/assets/js/plugins/bootstrap.min.js"></script>
<script src="/assets/js/plugins/fontawesome.js"></script>
<script src="/assets/js/plugins/aos.js"></script>
<script src="/assets/js/plugins/counter.js"></script>
<script src="/assets/js/plugins/gsap.min.js"></script>
<script src="/assets/js/plugins/ScrollTrigger.min.js"></script>
<script src="/assets/js/plugins/Splitetext.js"></script>
<script src="/assets/js/plugins/SmoothScroll.js"></script>
<script src="/assets/js/plugins/sidebar.js"></script>
<script src="/assets/js/plugins/magnific-popup.js"></script>
<script src="/assets/js/plugins/mobilemenu.js"></script>
<script src="/assets/js/plugins/owlcarousel.min.js"></script>
<script src="/assets/js/plugins/nice-select.js"></script>
<script src="/assets/js/plugins/waypoints.js"></script>
<script src="/assets/js/plugins/slick-slider.js"></script>
<script src="/assets/js/plugins/circle-progress.js"></script>
<script src="/assets/js/plugins/swiper.js"></script>
<script src="/assets/js/main.js"></script>

</body>
 
</html>