function languageChange(url) {
    var storedLang = getCookie('lang');
    if (storedLang) {
        $('html').attr('lang', storedLang);
    } else {
        storedLang = $('html').attr('lang');
    }

    // Set the selected language in the dropdown
    $('#languageSelect')
        .val(storedLang)
        .on('change', function() {
            var selectedLanguage = $(this).val();
            setCookie('lang', selectedLanguage, 30);

            // Reload the page
            window.location.href = url + '?lang=' + selectedLanguage;
        });
}