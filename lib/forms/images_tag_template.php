<div class="bpfb_images">
<?php $rel = md5(microtime() . rand());?>
<?php foreach ($images as $img) { ?>
	<?php if (!$img) continue; ?>
	<?php if (preg_match('!^' . preg_quote('http://') . '!i', $img)) { // Remote image ?>
		<img src="<?php echo $img; ?>" />
	<?php } else { ?>
		<?php $info = pathinfo($img);?>
		<a href="<?php echo bpfb_get_image_url($activity_blog_id) . $img; ?>" class="thickbox" rel="<?php echo $rel;?>">
			<img src="<?php echo bpfb_get_image_url($activity_blog_id) . $info['filename'] . '-bpfbt.' . strtolower($info['extension']); ?>" />
		</a>
	<?php } ?>
<?php } ?>
</div>