require.config({paths:{suluwebsite:"../../suluwebsite/dist"}}),define({name:"SuluWebsiteBundle",initialize:function(a){"use strict";var b=a.sandbox;a.components.addSource("suluwebsite","/bundles/suluwebsite/dist/components"),b.mvc.routes.push({route:"settings/cache",callback:function(){return'<div data-aura-component="cache@suluwebsite"/>'}})}});