var j = jQuery.noConflict();
j(".count").each(function () {
  j(this)
    .prop("Counter", 0)
    .animate(
      {
        Counter: j(this).text(),
      },
      {
        duration: 4000,
        easing: "swing",
        step: function (now) {
          now = Number(Math.ceil(now)).toLocaleString('en');
                                j(this).text(now);
        },
      }
    );
});
