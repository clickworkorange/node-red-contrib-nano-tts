# Node-RED nano-tts #

**Very early stages - not ready for use!**

### Inputs ###
+ #### payload *string* #### 
    The text to be turned into speech. This can include Pico TTS markup.
+ #### lang (optional) *string* #### 
    The voice language to use. Must be one of `en-US`, `en-GB`, `de-DE`, `fr-FR`, `es-ES` or `it-IT` (defaults to `en-US`).
+ #### pitch (optional) *float* #### 
    The voice pitch. Must be between 0.5 and 2.0 (defaults to 1).
+ #### speed (optional) *float* #### 
    The voice speed. Must be between 0.2 and 5.0 (defaults to 1).
+ #### volume (optional) *float* #### 
    The voice volume. Must be between 0.0 and 5.0 (defaults to 1). Values greater than 1 may lead to distortion.

### Outputs ###
+ #### payload *buffer | boolean* #### 
    A raw PCM buffer when set to ouptut one, otherwise a boolean indicating success.
+ #### filename *string* #### 
    The full path to the generated file, when set to produce a WAV file.
+ #### filesize *integer* #### 
    The generated file's size in bytes, when set to produce a WAV file.

### Details ###
This node uses the Pico TTS engine from SVOX, via the Nano TTS library, to generate 16-bit 16kHz audio by reading out the `msg.payload` in US English, British English, German, French, Spanish or Italian voices.

The node can output a raw PCM buffer containing the audio, write the audio to a WAV file, or speak it directly through the default soundcard of the machine running Node-RED.

Messages can specify their own settings with `msg.lang`, `msg.pitch`, `msg.speed`, `msg.volume`.

### Markup ###
The strings passed to this node may include Pico TTS specific markup, to affect particular properties of the speech generated. The below is only a brief summary of the most commonly used tags - see the Pico TTS manual for the full list and further details.
+ #### &lt;pitch&gt; *&lt;pitch level="..."&gt; ... &lt;/pitch&gt;* #### 
    Sets the pitch level for the enclosed block.
+ #### &lt;speed&gt; *&lt;speed level="..."&gt; ... &lt;/speed&gt;* #### 
    Sets the speed level for the enclosed block.
+ #### &lt;volume&gt; *&lt;volume level="..."&gt; ... &lt;/volume&gt;* #### 
    Sets the volume level for the enclosed block.
+ #### &lt;break&gt; *&lt;break time="..."/&gt;* #### 
    Inserts a pause with the duration specified by the `time` parameter (e.g. "1s" or "1000ms").
+ #### &lt;ignore&gt;*&lt;ignore&gt; ... &lt;/ignore&gt;* #### 
    Completely ignores the enclosed block (it will not be read out).
+ #### &lt;phoneme&gt; *&lt;phoneme ph="..."/&gt;* #### 
    Provides a phonemic or phonetic pronunciation for a word to be inserted into the text in the place of the markup. The value of `ph` should use the X-SAMPA phonetic alphabet to define the phoneme.
+ #### &lt;play&gt; *&lt;play file="..."/&gt; | &lt;play file="..."&gt; ... &lt;/play&gt;* #### 
    In the first form, this will play an audio file at the position where the tag appears. In the second form the audio file will play instead of the enclosed block of text.

### References ###
https://github.com/gmn/nanotts

![Exanmple flow](https://github.com/clickworkorange/node-red-contrib-nano-tts/blob/master/images/example_flow.png)
