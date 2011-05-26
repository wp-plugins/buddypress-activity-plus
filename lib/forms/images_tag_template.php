<div class="bpfb_images">
<?php $rel = md5(microtime() . rand());?>
<?php foreach ($images as $img) { ?>
	<?php if (!$img) continue; ?>
	<?php $info = pathinfo($img);?>
	<a href="<?php echo BPFB_BASE_IMAGE_URL . $img; ?>" class="thickbox" rel="<?php echo $rel;?>">
		<img src="<?php echo BPFB_BASE_IMAGE_URL . $info['filename'] . '-bpfbt.' . strtolower($info['extension']); ?>" />
	</a>
<?php } ?>
</div>