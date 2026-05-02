<?php
$blogUrlParam = $_GET['url'] ?? '';
$blog = null;
$error = false;

if (!empty($blogUrlParam)) {
    $apiUrl = 'https://drpraveenreddyortho.com/api/blogs?url=' . urlencode($blogUrlParam);
    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    if ($response !== false) {
        $data = json_decode($response, true);
        if (isset($data['success']) && $data['success'] && !empty($data['data'])) {
            $blog = $data['data'][0];
        } else {
            $error = true;
        }
    } else {
        $error = true;
    }
    curl_close($ch);
} else {
    $error = true;
}
?>
<!DOCTYPE html>
<html lang="en">
 
<head>
     <base href="/">
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title><?php echo !empty($blog['title']) ? htmlspecialchars($blog['title']) . ' | Dr Praveen Reddy P' : 'Blog | Dr Praveen Reddy - Bone & Joint Surgeon'; ?></title>

     <meta name="keywords" content="<?php echo htmlspecialchars($blog['metaKeywords'] ?? 'orthopedic doctor, bone specialist, joint surgeon, Dr Praveen Reddy'); ?>" />
    <meta name="description" content="<?php echo htmlspecialchars($blog['metaDescription'] ?? 'Read the latest health articles and orthopedic insights from Dr Praveen Reddy P, a leading bone and joint surgeon in LB Nagar, Hyderabad.'); ?>" />

    <!-- Open Graph / Social Sharing -->
    <meta property="og:title" content="<?php echo htmlspecialchars($blog['title'] ?? 'Blog | Dr Praveen Reddy P'); ?>" />
    <meta property="og:description" content="<?php echo htmlspecialchars($blog['metaDescription'] ?? ''); ?>" />
    <meta property="og:type" content="article" />
    <?php if (!empty($blog['postBanner'])): ?>
    <meta property="og:image" content="<?php echo htmlspecialchars(strpos($blog['postBanner'], 'http') === 0 ? $blog['postBanner'] : 'https://drpraveenreddyortho.com/' . $blog['postBanner']); ?>" />
    <?php endif; ?>
    <meta property="og:url" content="<?php echo htmlspecialchars('https://drpraveenreddyortho.com/blog-single.php?url=' . ($blogUrlParam ?? '')); ?>" />
    <meta property="og:site_name" content="Dr Praveen Reddy Ortho Clinic" />
    <meta name="author" content="<?php echo htmlspecialchars($blog['authorName'] ?? 'Dr Praveen Reddy P'); ?>" />

     <!--=====FAB ICON=======-->
    <link rel="shortcut icon" href="assets/img/logo/fav-logo1.png" type="image/x-icon">

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

<!--=====HEADER START=======-->
<?php include('header.php'); ?> 
<!--===== MOBILE HEADER STARTS =======-->
<!--===== HERO AREA STARTS =======-->
<div class="inner-header-section-area" style="background-image: url(assets/img/all-images/bg/innerpage-banner.png); background-position: center; background-repeat: no-repeat; background-size: cover;">
  <img src="assets/img/elements/logoicon.png" alt="" class="elements28">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-lg-12">
        <div class="hero-header">
          <h1 class="text-anime-style-1"><?php echo !empty($blog['title']) ? htmlspecialchars($blog['title']) : 'Blog'; ?></h1>
        </div>
      </div>
    </div>
  </div>
</div>
<!--===== HERO AREA ENDS =======-->

<!--===== BLOG AREA STARTS =======-->
<div class="vl-blog-details-section sp8">
    <div class="container">
        <div class="row">
            <div class="col-lg-8 m-auto">
                <div class="blog-others-sidebar">
                    <?php if ($error || empty($blog)): ?>
                        <div class="text-center py-5">
                            <h2>Blog article not found</h2>
                            <p>The article you are looking for might have been removed or the URL is incorrect.</p>
                            <a href="index.php" class="vl-btn4 mt-3">Return Home</a>
                        </div>
                    <?php else: ?>
                        <?php 
                          $baseUrl = 'https://drpraveenreddyortho.com/';
                          $image = 'assets/img/all-images/blog/blog-img4.png';
                          
                          if (!empty($blog['postBanner'])) {
                              $image = strpos($blog['postBanner'], 'http') === 0 ? $blog['postBanner'] : $baseUrl . $blog['postBanner'];
                          } else if (!empty($blog['postThumbnail'])) {
                              $image = strpos($blog['postThumbnail'], 'http') === 0 ? $blog['postThumbnail'] : $baseUrl . $blog['postThumbnail'];
                          }

                          $dateStr = '';
                          if (!empty($blog['dateOfPost'])) {
                              try {
                                  $dateObj = new DateTime($blog['dateOfPost']);
                                  $dateStr = $dateObj->format('d F Y');
                              } catch (Exception $e) {}
                          }
                        ?>
                        <div class="img1">
                            <img src="<?php echo htmlspecialchars($image); ?>" alt="<?php echo htmlspecialchars($blog['title'] ?? ''); ?>" style="width: 100%; border-radius: 8px;" onerror="this.onerror=null; this.src='data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'400\' viewBox=\'0 0 800 400\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23f5f0eb\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' font-family=\'sans-serif\' font-size=\'24\' font-weight=\'500\' fill=\'%23b8a99a\' dominant-baseline=\'middle\' text-anchor=\'middle\'%3ENo Image Available%3C/text%3E%3C/svg%3E'">
                        </div>
                        <div class="space32"></div>
                        <ul class="list-author">
                            <li><a href="javascript:void(0);">#<?php echo htmlspecialchars($blog['category'] ?? 'Health'); ?></a></li>
                            <li><a href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
                              <path d="M5.5384 1C5.68692 1 5.82936 1.06637 5.93438 1.18452C6.0394 1.30267 6.0984 1.46291 6.0984 1.63V2.8081H12.112V1.6381C12.112 1.47101 12.171 1.31077 12.276 1.19262C12.381 1.07447 12.5235 1.0081 12.672 1.0081C12.8205 1.0081 12.963 1.07447 13.068 1.19262C13.173 1.31077 13.232 1.47101 13.232 1.6381V2.8081H15.4C15.8242 2.8081 16.2311 2.99762 16.5311 3.33499C16.8311 3.67236 16.9998 4.12997 17 4.6072V17.2009C16.9998 17.6781 16.8311 18.1357 16.5311 18.4731C16.2311 18.8105 15.8242 19 15.4 19H2.6C2.17579 19 1.76895 18.8105 1.46891 18.4731C1.16888 18.1357 1.00021 17.6781 1 17.2009V4.6072C1.00021 4.12997 1.16888 3.67236 1.46891 3.33499C1.76895 2.99762 2.17579 2.8081 2.6 2.8081H4.9784V1.6291C4.97861 1.46217 5.03771 1.30216 5.1427 1.1842C5.2477 1.06625 5.39002 1 5.5384 1ZM2.12 7.9678V17.2009C2.12 17.2718 2.13242 17.342 2.15654 17.4075C2.18066 17.4731 2.21602 17.5326 2.26059 17.5827C2.30516 17.6329 2.35808 17.6727 2.41631 17.6998C2.47455 17.7269 2.53697 17.7409 2.6 17.7409H15.4C15.463 17.7409 15.5255 17.7269 15.5837 17.6998C15.6419 17.6727 15.6948 17.6329 15.7394 17.5827C15.784 17.5326 15.8193 17.4731 15.8435 17.4075C15.8676 17.342 15.88 17.2718 15.88 17.2009V7.9804L2.12 7.9678ZM6.3336 14.1571V15.6565H5V14.1571H6.3336ZM9.6664 14.1571V15.6565H8.3336V14.1571H9.6664ZM13 14.1571V15.6565H11.6664V14.1571H13ZM6.3336 10.5778V12.0772H5V10.5778H6.3336ZM9.6664 10.5778V12.0772H8.3336V10.5778H9.6664ZM13 10.5778V12.0772H11.6664V10.5778H13ZM4.9784 4.0672H2.6C2.53697 4.0672 2.47455 4.08117 2.41631 4.1083C2.35808 4.13544 2.30516 4.17522 2.26059 4.22536C2.21602 4.27551 2.18066 4.33504 2.15654 4.40055C2.13242 4.46607 2.12 4.53629 2.12 4.6072V6.7087L15.88 6.7213V4.6072C15.88 4.53629 15.8676 4.46607 15.8435 4.40055C15.8193 4.33504 15.784 4.27551 15.7394 4.22536C15.6948 4.17522 15.6419 4.13544 15.5837 4.1083C15.5255 4.08117 15.463 4.0672 15.4 4.0672H13.232V4.9033C13.232 5.07039 13.173 5.23063 13.068 5.34878C12.963 5.46693 12.8205 5.5333 12.672 5.5333C12.5235 5.5333 12.381 5.46693 12.276 5.34878C12.171 5.23063 12.112 5.07039 12.112 4.9033V4.0672H6.0984V4.8952C6.0984 5.06229 6.0394 5.22253 5.93438 5.34068C5.82936 5.45883 5.68692 5.5252 5.5384 5.5252C5.38988 5.5252 5.24744 5.45883 5.14242 5.34068C5.0374 5.22253 4.9784 5.06229 4.9784 4.8952V4.0672Z" fill="#31353D"/>
                              </svg> <?php echo htmlspecialchars($dateStr); ?> <span> | </span></a></li>
                            <li><a href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M4.16406 17.5C4.16406 14.2783 6.77574 11.6667 9.9974 11.6667C13.2191 11.6667 15.8307 14.2783 15.8307 17.5M13.3307 5.83333C13.3307 7.67428 11.8383 9.16667 9.9974 9.16667C8.15645 9.16667 6.66406 7.67428 6.66406 5.83333C6.66406 3.99238 8.15645 2.5 9.9974 2.5C11.8383 2.5 13.3307 3.99238 13.3307 5.83333Z" stroke="#31353D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg> <?php echo htmlspecialchars($blog['authorName'] ?? 'Medicax Clinic'); ?> <span> | </span></a></li>
                        </ul>
                        <div class="space24"></div>
                        <h2><?php echo htmlspecialchars($blog['title'] ?? ''); ?></h2>
                        <div class="space18"></div>
                        <style>
                            .blog-formatted-content {
                                max-width: 100%;
                                overflow-wrap: break-word;
                                word-wrap: break-word;
                                word-break: break-word;
                                overflow-x: hidden;
                            }
                            .blog-formatted-content img {
                                max-width: 100%;
                                height: auto;
                            }
                            .blog-formatted-content p,
                            .blog-formatted-content h1,
                            .blog-formatted-content h2,
                            .blog-formatted-content h3,
                            .blog-formatted-content h4,
                            .blog-formatted-content h5,
                            .blog-formatted-content h6,
                            .blog-formatted-content li,
                            .blog-formatted-content span {
                                max-width: 100%;
                                overflow-wrap: break-word;
                                word-wrap: break-word;
                            }
                        </style>
                        <div class="blog-formatted-content">
                            <?php 
                                // Replace &nbsp; with regular spaces so text wraps properly
                                $content = $blog['blogContent'] ?? '';
                                $content = str_replace('&nbsp;', ' ', $content);
                                echo $content; 
                            ?>
                        </div>
                        <div class="space32"></div>
                        
                        <?php 
                        $tagsStr = $blog['tags'] ?? '[]';
                        $tags = [];
                        if (is_string($tagsStr)) {
                            $tags = json_decode($tagsStr, true);
                            if (!is_array($tags)) $tags = [];
                        }
                        ?>
                        <?php if(!empty($tags)): ?>
                        <div class="tags-social">
                            <div class="tags">
                                <ul>
                                    <li>Tags:</li>
                                    <?php foreach($tags as $index => $tag): ?>
                                    <li><a href="javascript:void(0);" class="<?php echo $index === count($tags)-1 ? 'm-0' : ''; ?>">#<?php echo htmlspecialchars(trim($tag)); ?></a></li>
                                    <?php endforeach; ?>
                                </ul>
                            </div>
                        </div>
                        <?php endif; ?>
                        
                        <div class="space48"></div>
                    <?php endif; ?>
                </div>
            </div>

        </div>
    </div>
</div>
<!--===== BLOG AREA ENDS =======-->

<!--===== BLOG AREA STARTS =======-->
<div class="vl-blog-4-area sp2">
  <div class="container">
     <div class="row">
        <div class="col-lg-6 m-auto">
           <div class="vl-blog-1-section-box heading4 text-center space-margin60">
              <div class="space24"></div>
              <h2 class="vl-section-title text-anime-style-3">Read More Latest Blog</h2>
           </div>
        </div>
     </div>
     <div class="row">
        <?php 
          $recentBlogs = array_slice($allBlogs, 0, 3);
          if(!empty($recentBlogs)): 
        ?>
           <?php foreach($recentBlogs as $blog): ?>
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
             
             // Generate clean URL for blog post (e.g., /sample-blog-posts)
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
                <p>No recent news available.</p>
            </div>
        <?php endif; ?>
     </div>
  </div>
</div>
<!--===== BLOG AREA ENDS =======-->
 
 
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
